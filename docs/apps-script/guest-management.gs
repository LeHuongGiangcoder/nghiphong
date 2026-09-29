/**
 * Quản lý khách mời — Ngô Mỹ Nghi & Nguyễn Thanh Phong
 *
 * Dán toàn bộ file này vào Extensions → Apps Script của Google Sheet
 * "Thanh Phong & Mỹ Nghi_Guest Management".
 * Hướng dẫn cài đặt: docs/guest-management.md
 *
 * Sheet "RSVP" hiện có 9 cột:
 *   A No · B Name · C Slug · D Link · E Attendance
 *   F Number · G Meal · H Wish · I Updated
 *
 * Cô dâu chú rể chỉ điền cột B (Name). Menu "💌 Wedding → Tạo slug + link"
 * sinh ra A, C, D. Khách mở link riêng, trả lời form, script ghi ngược
 * E–G vào ĐÚNG dòng của khách đó (tìm theo slug) chứ không thêm dòng mới.
 *
 * Cột được nhận diện theo TÊN TIÊU ĐỀ ở hàng 1, không theo vị trí. Thêm hay
 * đổi chỗ cột đều không phải sửa code — "Number" và "Meal" ở trên chính là
 * thêm vào sau và script tự nhận. Còn nhận được "Note" (ghi chú dị ứng) và
 * "Lang" (khách xem bản vi hay en) nếu muốn lưu thêm.
 */

// ⚠️ Sửa thành domain thật của web cưới, KHÔNG có dấu / ở cuối.
const SITE_URL = 'https://nghiphong.gloweb.site';

const SHEET_NAME = 'RSVP';
const FIRST_ROW = 2; // hàng 1 là tiêu đề

/**
 * Tiêu đề nào ứng với trường nào. So khớp sau khi bỏ dấu và hạ chữ thường,
 * nên "Lời chúc", "loi chuc" và "Wish" đều về cùng một chỗ.
 */
const HEADERS = {
  no: ['no', 'stt', 'so thu tu'],
  name: ['name', 'ten', 'ho ten', 'ten khach'],
  slug: ['slug', 'ma', 'ma khach'],
  link: ['link', 'duong dan', 'invite link'],
  attendance: ['attendance', 'attending', 'tham du', 'xac nhan'],
  wish: ['wish', 'wishes', 'loi chuc', 'loi nhan'],
  updated: ['updated', 'update', 'thoi gian', 'cap nhat'],
  // Không bắt buộc — chỉ điền nếu sheet có cột tương ứng
  guests: ['guests', 'guest', 'number', 'so khach', 'so luong'],
  meal: ['meal', 'mon', 'mon an', 'thuc don'],
  note: ['note', 'ghi chu', 'meal notes'],
  lang: ['lang', 'language', 'ngon ngu'],
};

/* ────────────────────────────────────────────────────────────────────────────
   Menu trong Sheet
   ──────────────────────────────────────────────────────────────────────── */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('💌 Wedding')
    .addItem('Tạo slug + link cho khách mới', 'generateLinks')
    .addItem('Tạo lại slug + link cho dòng đang chọn', 'regenerateSelectedRows')
    .addSeparator()
    .addItem('Copy link của dòng đang chọn', 'copySelectedLinks')
    .addItem('Xoá câu trả lời của dòng đang chọn', 'clearSelectedResponses')
    .addToUi();
}

/** Sinh slug + link cho mọi dòng đã có Name mà chưa có slug */
function generateLinks() {
  const result = fillRows_(function (row) {
    return !row.slug;
  });
  toast_(result.done + ' khách đã có link mới. Bỏ qua ' + result.skipped + ' dòng đã có sẵn.');
}

/** Ép sinh lại cho các dòng đang bôi đen — dùng khi sửa tên khách */
function regenerateSelectedRows() {
  const rows = selectedRowNumbers_();
  if (!rows.length) {
    toast_('Bôi đen ít nhất một dòng khách trước đã nha.');
    return;
  }
  const result = fillRows_(function (row) {
    return rows.indexOf(row.rowNumber) !== -1;
  }, true);
  toast_('Đã tạo lại link cho ' + result.done + ' khách.');
}

/** Hiện link của các dòng đang chọn trong một hộp thoại để copy đi gửi */
function copySelectedLinks() {
  const cols = columns_();
  const sheet = guestSheet_();
  const rows = selectedRowNumbers_();
  if (!rows.length) {
    toast_('Bôi đen ít nhất một dòng khách trước đã nha.');
    return;
  }

  const lines = rows
    .map(function (rowNumber) {
      const name = sheet.getRange(rowNumber, cols.name).getValue();
      const link = cols.link ? sheet.getRange(rowNumber, cols.link).getValue() : '';
      return name && link ? name + '\n' + link : '';
    })
    .filter(Boolean);

  if (!lines.length) {
    toast_('Các dòng đang chọn chưa có link. Chạy "Tạo slug + link" trước nha.');
    return;
  }

  SpreadsheetApp.getUi().alert('Link mời', lines.join('\n\n'), SpreadsheetApp.getUi().ButtonSet.OK);
}

/** Xoá câu trả lời để mời lại từ đầu */
function clearSelectedResponses() {
  const cols = columns_();
  const sheet = guestSheet_();
  const rows = selectedRowNumbers_();
  const answerCols = ['attendance', 'wish', 'updated', 'guests', 'meal', 'note', 'lang'];

  rows.forEach(function (rowNumber) {
    answerCols.forEach(function (key) {
      if (cols[key]) sheet.getRange(rowNumber, cols[key]).clearContent();
    });
  });
  toast_('Đã xoá câu trả lời của ' + rows.length + ' dòng.');
}

/* ────────────────────────────────────────────────────────────────────────────
   Web app: trang cưới gọi vào đây
   ──────────────────────────────────────────────────────────────────────── */

/**
 * GET ?slug=abc → { ok: true, name: 'Ngô Mỹ Nghi', answered: false }
 * Trang cưới dùng để hiện "Thân mời <tên khách>" và điền sẵn ô tên.
 */
function doGet(e) {
  const slug = e && e.parameter ? String(e.parameter.slug || e.parameter.to || '').trim() : '';
  if (!slug) return json_({ ok: false, error: 'missing slug' });

  const found = findBySlug_(slug);
  if (!found) return json_({ ok: false, error: 'not found' });

  return json_({
    ok: true,
    slug: found.slug,
    name: found.name,
    answered: Boolean(found.attendance),
  });
}

/**
 * POST { slug, name, attending, guests, meal, mealNotes, wishes, lang }
 * Có slug → ghi đè câu trả lời vào đúng dòng đó.
 * Không có slug (khách vào thẳng trang chủ) → thêm một dòng mới ở cuối.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = guestSheet_();
    const cols = columns_();

    const attending = data.attending === 'yes';
    const answer = {
      attendance: attending ? 'Có' : 'Không',
      guests: attending ? Number(data.guests || 1) : 0,
      meal: attending ? data.meal || '' : '',
      note: attending ? data.mealNotes || '' : '',
      wish: data.wishes || '',
      lang: data.lang || '',
      updated: new Date(),
    };

    const slug = String(data.slug || '').trim();
    const found = slug ? findBySlug_(slug) : null;
    let rowNumber;

    if (found) {
      rowNumber = found.rowNumber;
    } else {
      // Khách lạ: vẫn ghi lại để không mất câu trả lời nào
      rowNumber = sheet.getLastRow() + 1;
      if (cols.no) sheet.getRange(rowNumber, cols.no).setValue(rowNumber - FIRST_ROW + 1);
      sheet.getRange(rowNumber, cols.name).setValue(data.name || '(không rõ tên)');
    }

    Object.keys(answer).forEach(function (key) {
      if (cols[key]) sheet.getRange(rowNumber, cols[key]).setValue(answer[key]);
    });

    return json_({ ok: true, row: rowNumber });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ────────────────────────────────────────────────────────────────────────────
   Bên trong
   ──────────────────────────────────────────────────────────────────────── */

function guestSheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Không thấy sheet tên "' + SHEET_NAME + '"');
  return sheet;
}

/**
 * Đọc hàng tiêu đề một lần → { name: 2, slug: 3, ... } (số cột, đếm từ 1).
 * Cột không có trong sheet thì giá trị là 0, mọi chỗ ghi đều bỏ qua.
 */
function columns_() {
  const sheet = guestSheet_();
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const cols = {};
  Object.keys(HEADERS).forEach(function (key) {
    cols[key] = 0;
  });

  header.forEach(function (cell, i) {
    const label = slugify_(cell).replace(/-/g, ' ');
    if (!label) return;
    Object.keys(HEADERS).forEach(function (key) {
      if (!cols[key] && HEADERS[key].indexOf(label) !== -1) cols[key] = i + 1;
    });
  });

  if (!cols.name) throw new Error('Sheet thiếu cột tiêu đề "Name"');
  if (!cols.slug) throw new Error('Sheet thiếu cột tiêu đề "Slug"');
  return cols;
}

/** Đọc toàn bộ vùng khách một lần — nhanh hơn nhiều so với đọc từng ô */
function readGuests_() {
  const sheet = guestSheet_();
  const cols = columns_();
  const lastRow = sheet.getLastRow();
  if (lastRow < FIRST_ROW) return [];

  const values = sheet
    .getRange(FIRST_ROW, 1, lastRow - FIRST_ROW + 1, sheet.getLastColumn())
    .getValues();

  return values.map(function (row, i) {
    const at = function (col) {
      return col ? String(row[col - 1] || '').trim() : '';
    };
    return {
      rowNumber: FIRST_ROW + i,
      name: at(cols.name),
      slug: at(cols.slug),
      attendance: at(cols.attendance),
    };
  });
}

function findBySlug_(slug) {
  const wanted = slug.toLowerCase();
  const guests = readGuests_();
  for (let i = 0; i < guests.length; i += 1) {
    if (guests[i].slug.toLowerCase() === wanted) return guests[i];
  }
  return null;
}

/**
 * Điền No + Slug + Link cho những dòng thoả `shouldFill`.
 * Ghi cả khối một lần ở cuối thay vì setValue từng ô — sheet vài trăm dòng
 * mà ghi lẻ thì Apps Script hết thời gian chạy.
 */
function fillRows_(shouldFill, force) {
  const sheet = guestSheet_();
  const cols = columns_();
  const guests = readGuests_();
  if (!guests.length) return { done: 0, skipped: 0 };

  // Chỉ đọc/ghi đúng dải cột cần sửa, để không đụng vào câu trả lời của khách
  const width = Math.max(cols.no, cols.slug, cols.link);
  const block = sheet.getRange(FIRST_ROW, 1, guests.length, width).getValues();

  // Slug đã dùng, để hai khách trùng tên không đè lên nhau
  const taken = {};
  guests.forEach(function (g) {
    if (g.slug && !(force && shouldFill(g))) taken[g.slug.toLowerCase()] = true;
  });

  let done = 0;
  let skipped = 0;

  guests.forEach(function (g, i) {
    if (!g.name) return; // dòng trống ở cuối sheet, bỏ qua im lặng

    if (cols.no) block[i][cols.no - 1] = i + 1;

    if (!shouldFill(g)) {
      skipped += 1;
      return;
    }

    const slug = uniqueSlug_(g.name, taken);
    taken[slug] = true;

    block[i][cols.slug - 1] = slug;
    if (cols.link) block[i][cols.link - 1] = SITE_URL + '/?to=' + slug;
    done += 1;
  });

  sheet.getRange(FIRST_ROW, 1, guests.length, width).setValues(block);
  return { done: done, skipped: skipped };
}

/** "Nguyễn Văn A" → "nguyen-van-a"; trùng thì thêm -2, -3… */
function uniqueSlug_(name, taken) {
  const base = slugify_(name) || 'khach';
  if (!taken[base]) return base;

  let n = 2;
  while (taken[base + '-' + n]) n += 1;
  return base + '-' + n;
}

function slugify_(text) {
  return String(text)
    .normalize('NFD')
    // Bỏ dấu tiếng Việt; chữ đ/Đ không có dạng tổ hợp nên phải thay riêng
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function selectedRowNumbers_() {
  const ranges = guestSheet_().getActiveRangeList();
  if (!ranges) return [];

  const rows = [];
  ranges.getRanges().forEach(function (range) {
    for (let r = range.getRow(); r < range.getRow() + range.getNumRows(); r += 1) {
      if (r >= FIRST_ROW && rows.indexOf(r) === -1) rows.push(r);
    }
  });
  return rows.sort(function (a, b) {
    return a - b;
  });
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function toast_(message) {
  SpreadsheetApp.getActiveSpreadsheet().toast(message, '💌 Wedding', 6);
}
