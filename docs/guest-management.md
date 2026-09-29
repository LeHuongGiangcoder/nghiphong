# Quản lý khách mời + link mời riêng

Mỗi khách có một link riêng dạng `https://…/?to=ngo-my-nghi`. Khách mở link,
trang cưới chào đúng tên họ, họ trả lời form, và câu trả lời rơi đúng vào dòng
của họ trong Google Sheet — không đẻ ra dòng mới.

Script: [`docs/apps-script/guest-management.gs`](apps-script/guest-management.gs)

## 1. Dán script vào Sheet

1. Mở sheet **Thanh Phong & Mỹ Nghi_Guest Management** → `Extensions` → `Apps Script`.
2. Xoá sạch `Code.gs`, dán toàn bộ nội dung `guest-management.gs` vào.
3. Sửa dòng đầu cho đúng domain thật, **không có dấu `/` ở cuối**:

   ```js
   const SITE_URL = 'https://nghiphong.vercel.app';
   ```

4. `Ctrl/Cmd + S`, rồi load lại tab Google Sheet. Menu **💌 Wedding** hiện ra
   cạnh `Help`.

## 2. Tạo link cho khách

Chỉ cần điền **cột B (Name)**. Cột `No`, `Slug`, `Link` do script sinh ra.

| Menu | Làm gì |
|---|---|
| Tạo slug + link cho khách mới | Điền cho mọi dòng có Name mà chưa có Slug |
| Tạo lại slug + link cho dòng đang chọn | Dùng khi sửa tên khách — slug cũ sẽ chết |
| Copy link của dòng đang chọn | Hiện tên + link để copy đi gửi Zalo |
| Xoá câu trả lời của dòng đang chọn | Dọn E–G để mời lại từ đầu |

Hai khách trùng tên tự được `-2`, `-3`. Dấu tiếng Việt và chữ `đ` xử lý đúng:
`Trần Đức Đạt` → `tran-duc-dat`.

> **Đừng sửa tay cột Slug.** Slug là thứ nối link đã gửi với dòng trong sheet;
> sửa nó là link đã gửi cho khách thành vô hiệu.

## 3. Deploy làm Web App

Trong Apps Script: `Deploy` → `New deployment` → chọn type **Web app**.

- **Execute as:** `Me`
- **Who has access:** `Anyone` ← bắt buộc, không thì trang web gọi vào sẽ bị chặn

Bấm `Deploy`, cấp quyền, rồi copy **Web app URL** (dạng
`https://script.google.com/macros/s/AKfy…/exec`). Đó là endpoint của trang web.

> Mỗi lần sửa code phải `Deploy` → `Manage deployments` → bút chì → `Version: New version`.
> Không làm bước này thì URL cũ vẫn chạy code cũ.

## 4. Trang web gọi vào như thế nào

**Lấy tên khách** — khi trang load, đọc `?to=` trên URL:

```
GET  <WEB_APP_URL>?slug=ngo-my-nghi
→ { "ok": true, "slug": "ngo-my-nghi", "name": "Ngô Mỹ Nghi", "answered": false }
```

`answered: true` nghĩa là khách này đã trả lời rồi — dùng để hiện "Bạn đã phản
hồi rồi nha" thay vì form trắng.

**Gửi câu trả lời:**

```js
await fetch(WEB_APP_URL, {
  method: 'POST',
  // ⚠️ PHẢI là text/plain. Để application/json thì trình duyệt bắn preflight
  // OPTIONS, mà Apps Script không trả lời OPTIONS → fetch fail vì CORS.
  headers: { 'Content-Type': 'text/plain;charset=utf-8' },
  body: JSON.stringify({
    slug,            // lấy từ ?to= trên URL; không có thì bỏ trống
    name,
    attending,       // 'yes' | 'no'
    guests,          // số
    meal,            // nhãn món đã chọn
    mealNotes,
    wishes,
    lang,            // 'vi' | 'en'
  }),
});
```

Khách vào thẳng trang chủ (không có `?to=`) vẫn trả lời được — script thêm một
dòng mới ở cuối sheet, để không mất câu trả lời nào.

## 5. Muốn lưu thêm số khách / món ăn

Sheet hiện có 7 cột nên **`guests`, `meal`, `mealNotes` gửi lên sẽ bị bỏ đi** —
không có chỗ để ghi.

Script dò cột theo **tên tiêu đề ở hàng 1**, không theo vị trí. Nên chỉ cần thêm
cột với tiêu đề đúng là script tự điền, **không phải sửa code**:

| Thêm tiêu đề | Sẽ chứa |
|---|---|
| `Guests` | Số khách đi cùng |
| `Meal` | Món đã chọn |
| `Note` | Ghi chú dị ứng (ô "Khác / dị ứng") |
| `Lang` | Khách xem bản `vi` hay `en` |

Tiêu đề tiếng Việt cũng nhận: `Họ tên`, `Xác nhận`, `Lời chúc`, `Cập nhật`,
`Số khách`, `Món`, `Ghi chú`.

## 6. Còn thiếu gì

Form RSVP trên web **chưa gọi vào endpoint này** — hiện nó mới `console.info`
payload rồi hiện màn hình cảm ơn (xem `src/components/sections/Rsvp.tsx`).
Phần nối web ↔ Apps Script (đọc `?to=`, chào đúng tên, POST thật) là bước tiếp theo.
