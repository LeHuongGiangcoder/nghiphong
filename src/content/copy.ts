/**
 * Every guest-facing string lives here. English is primary; Vietnamese is the
 * toggle. To change wording, times or venue details, edit this file only.
 */

export type Lang = "en" | "vi";

/* ------------------------------------------------------------------ facts */

/** Day starts at the first look, Asia/Ho_Chi_Minh (UTC+7). */
export const WEDDING_DATE_ISO = "2026-12-13T16:30:00+07:00";
/** TODO: confirm when the after-party actually ends. */
export const WEDDING_END_ISO = "2026-12-13T22:30:00+07:00";

export const MAPS_URL = "https://maps.app.goo.gl/zuj5tnv3C6Ak7R4C7";

/** Names without diacritics — Season Serif has no stacked Vietnamese accents. */
export const DISPLAY_NAMES = {
  bride: "Ngo My Nghi",
  groom: "Nguyen Thanh Phong",
};

/** Monogram initials — taken from the given names (Nghi, Phong). */
export const INITIALS = { bride: "N", groom: "P" };

/* ------------------------------------------------------------------- copy */

type Dict = {
  langLabel: string;
  nav: { greeting: string; agenda: string; rsvp: string; skip: string };
  hero: {
    eyebrow: string;
    and: string;
    saveTheDate: string;
    invite: string;
    dateLine: string;
    dayLine: string;
    venueShort: string;
    cta: string;
  };
  countdown: { days: string; hours: string; minutes: string; seconds: string; over: string };
  greeting: { eyebrow: string; title: string; body: string[]; signoff: string };
  agenda: {
    eyebrow: string;
    title: string;
    dateFull: string;
    items: { time: string; title: string; note: string }[];
    venueTitle: string;
    venueName: string;
    venueAddress: string;
    mapCta: string;
    calendarCta: string;
    calendarTitle: string;
  };
  dress: { eyebrow: string; title: string; body: string; yes: string; no: string };
  rsvp: {
    eyebrow: string;
    title: string;
    intro: string;
    deadline: string;
    name: string;
    namePlaceholder: string;
    nameError: string;
    attending: string;
    attendingError: string;
    yes: string;
    no: string;
    meal: string;
    mealHint: string;
    meals: string[];
    wishes: string;
    wishesPlaceholder: string;
    submit: string;
    submitting: string;
    thanksYesTitle: string;
    thanksYesBody: string;
    thanksNoTitle: string;
    thanksNoBody: string;
    again: string;
  };
  footer: { line: string; date: string };
};

export const COPY: Record<Lang, Dict> = {
  en: {
    langLabel: "Tiếng Việt",
    nav: {
      greeting: "Our note",
      agenda: "Details",
      rsvp: "RSVP",
      skip: "Skip to content",
    },
    hero: {
      eyebrow: "Together with our families",
      and: "and",
      saveTheDate: "Save the Date",
      invite: "joyfully invite you to the celebration of our marriage",
      dateLine: "13 . 12 . 2026",
      dayLine: "Sunday",
      venueShort: "Hotel Nikko Saigon",
      cta: "RSVP",
    },
    countdown: {
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
      over: "Today is the day",
    },
    greeting: {
      eyebrow: "A note from us",
      title: "Welcome",
      body: [
        "There are moments a heart keeps quietly, and this is one of them. After all the seasons we have walked through side by side, we are finally saying yes — out loud, and in front of the people we love most.",
        "Your presence is the part we look forward to the very most. Come sit with us, raise a glass, and let the evening be gentle and full.",
      ],
      signoff: "With all our love,",
    },
    agenda: {
      eyebrow: "When & where",
      title: "The Celebration",
      dateFull: "Sunday, 13 December 2026",
      items: [
        { time: "16:30", title: "First Look", note: "" },
        { time: "17:00", title: "Welcome", note: "" },
        { time: "18:00", title: "Photos with Guests", note: "" },
        { time: "19:00 –\u00A019:30", title: "Ceremony", note: "" },
        { time: "19:30", title: "Dinner", note: "" },
        { time: "21:00", title: "After Party", note: "" },
      ],
      venueTitle: "The venue",
      venueName: "Hotel Nikko Saigon",
      venueAddress: "235 Nguyễn Văn Cừ, District 1, Ho Chi Minh City",
      mapCta: "Open in maps",
      calendarCta: "Add to calendar",
      calendarTitle: "Wedding of Ngo My Nghi & Nguyen Thanh Phong",
    },
    dress: {
      eyebrow: "Dress code",
      title: "Pastel",
      body: "We would love to see a soft, sunlit palette — blush, butter, sage, sky, lilac.",
      yes: "Any pastel shade",
      no: "Kindly avoid black, red and white",
    },
    rsvp: {
      eyebrow: "Répondez s'il vous plaît",
      title: "Will you join us?",
      intro: "Let us know so we can save you a seat.",
      deadline: "Kindly reply before 13 November 2026.",
      name: "Your name",
      namePlaceholder: "Full name",
      nameError: "Please tell us your name.",
      attending: "Will you attend?",
      attendingError: "Please choose one.",
      yes: "Joyfully accepts",
      no: "Regretfully declines",
      meal: "Meal preference",
      mealHint: "So the kitchen can look after you.",
      meals: ["No preference", "Vegetarian", "No seafood", "Other / allergy"],
      wishes: "A wish for the couple",
      wishesPlaceholder: "Write something we can keep…",
      submit: "Send",
      submitting: "Sending…",
      thanksYesTitle: "See you there",
      thanksYesBody:
        "Thank you — your seat is saved. We cannot wait to celebrate with you on 13 December.",
      thanksNoTitle: "Thank you",
      thanksNoBody:
        "We will miss you on the day, but we are grateful you let us know. Your wishes mean the world.",
      again: "Send another reply",
    },
    footer: { line: "Ngo My Nghi & Nguyen Thanh Phong", date: "13 . 12 . 2026" },
  },

  vi: {
    langLabel: "English",
    nav: {
      greeting: "Lời chào",
      agenda: "Chi tiết",
      rsvp: "Xác nhận",
      skip: "Đến nội dung chính",
    },
    hero: {
      eyebrow: "Cùng với gia đình hai bên",
      and: "và",
      saveTheDate: "Save the Date",
      invite:
        "trân trọng kính mời bạn đến chung vui trong ngày hạnh phúc của chúng mình",
      dateLine: "13 . 12 . 2026",
      dayLine: "Chủ Nhật",
      venueShort: "Khách sạn Nikko Sài Gòn",
      cta: "Xác nhận tham dự",
    },
    countdown: {
      days: "Ngày",
      hours: "Giờ",
      minutes: "Phút",
      seconds: "Giây",
      over: "Hôm nay là ngày ấy",
    },
    greeting: {
      eyebrow: "Đôi lời từ chúng mình",
      title: "Lời chào",
      body: [
        "Có những khoảnh khắc mà trái tim lặng lẽ giữ lại, và đây là một trong số đó. Sau bao mùa cùng nhau bước qua, chúng mình cuối cùng cũng nói lời đồng ý — thật to, trước những người thương yêu nhất.",
        "Điều chúng mình mong chờ nhất chính là sự có mặt của bạn. Hãy đến ngồi cùng chúng mình, nâng ly, và để buổi tối ấy thật dịu dàng và trọn vẹn.",
      ],
      signoff: "Thương mến,",
    },
    agenda: {
      eyebrow: "Thời gian & địa điểm",
      title: "Chương trình",
      dateFull: "Chủ Nhật, ngày 13 tháng 12 năm 2026",
      items: [
        { time: "16:30", title: "First Look", note: "" },
        { time: "17:00", title: "Đón khách", note: "" },
        { time: "18:00", title: "Đón khách chụp ảnh", note: "" },
        { time: "19:00 –\u00A019:30", title: "Lễ thành hôn", note: "" },
        { time: "19:30", title: "Dùng tiệc", note: "" },
        { time: "21:00", title: "After Party", note: "" },
      ],
      venueTitle: "Địa điểm",
      venueName: "Khách sạn Nikko Sài Gòn",
      venueAddress: "235 Nguyễn Văn Cừ, Quận 1, TP. Hồ Chí Minh",
      mapCta: "Xem bản đồ",
      calendarCta: "Thêm vào lịch",
      calendarTitle: "Lễ thành hôn Ngo My Nghi & Nguyen Thanh Phong",
    },
    dress: {
      eyebrow: "Trang phục",
      title: "Pastel",
      body: "Chúng mình rất mong được thấy những gam màu dịu nhẹ — hồng phấn, vàng bơ, xanh sage, xanh trời, tím lilac.",
      yes: "Mọi sắc pastel",
      no: "Vui lòng tránh màu đen, đỏ và trắng",
    },
    rsvp: {
      eyebrow: "Xác nhận tham dự",
      title: "Bạn sẽ đến chứ?",
      intro: "Cho chúng mình biết để dành sẵn một chỗ ngồi nhé.",
      deadline: "Vui lòng phản hồi trước ngày 13.11.2026.",
      name: "Tên của bạn",
      namePlaceholder: "Họ và tên",
      nameError: "Bạn cho chúng mình biết tên với nhé.",
      attending: "Bạn có tham dự không?",
      attendingError: "Vui lòng chọn một mục.",
      yes: "Chắc chắn có mặt",
      no: "Rất tiếc, mình không đến được",
      meal: "Khẩu phần ăn",
      mealHint: "Để nhà bếp chuẩn bị chu đáo cho bạn.",
      meals: ["Không yêu cầu đặc biệt", "Món chay", "Không hải sản", "Khác / dị ứng"],
      wishes: "Lời chúc gửi cô dâu chú rể",
      wishesPlaceholder: "Viết đôi dòng để chúng mình giữ lại…",
      submit: "Gửi",
      submitting: "Đang gửi…",
      thanksYesTitle: "Hẹn gặp bạn nhé",
      thanksYesBody:
        "Cảm ơn bạn — chỗ ngồi đã được giữ. Chúng mình rất mong đến ngày 13 tháng 12.",
      thanksNoTitle: "Cảm ơn bạn",
      thanksNoBody:
        "Chúng mình sẽ nhớ bạn trong ngày ấy, nhưng thật biết ơn vì bạn đã báo trước. Lời chúc của bạn là món quà lớn.",
      again: "Gửi phản hồi khác",
    },
    footer: { line: "Ngo My Nghi & Nguyen Thanh Phong", date: "13 . 12 . 2026" },
  },
};
