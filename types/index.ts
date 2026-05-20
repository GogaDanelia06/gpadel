export type Language = "ka" | "en";

export interface Translation {
  // Navbar
  nav_home: string;
  nav_about: string;
  nav_book: string;
  nav_contact: string;

  // Hero
  hero_headline: string;
  hero_subheadline: string;
  hero_cta: string;

  // About
  about_title: string;
  about_p1: string;
  about_p2: string;

  // Courts
  courts_title: string;
  courts_subtitle: string;
  court1_name: string;
  court1_desc: string;
  court2_name: string;
  court2_desc: string;
  court_per_person: string;
  court_rental: string;
  court_book_now: string;
  court_hour: string;
  court_features_title: string;
  court_feature_lights: string;
  court_feature_surface: string;
  court_feature_equipment: string;

  // Reviews
  reviews_title: string;
  reviews_subtitle: string;

  // Contact
  contact_title: string;
  contact_phone: string;
  contact_address: string;
  contact_hours: string;
  contact_hours_value: string;
  contact_map_placeholder: string;

  // Footer
  footer_rights: string;
  footer_lgbtq: string;

  // Booking
  book_title: string;
  book_step1: string;
  book_step2: string;
  book_step3: string;
  book_select_date: string;
  book_select_time: string;
  book_available: string;
  book_booked: string;
  book_next: string;
  book_back: string;
  book_your_name: string;
  book_your_phone: string;
  book_your_email: string;
  book_players: string;
  book_players_2: string;
  book_players_4: string;
  book_payment_method: string;
  book_bog: string;
  book_tbc: string;
  book_summary: string;
  book_summary_date: string;
  book_summary_time: string;
  book_summary_players: string;
  book_summary_price: string;
  book_confirm: string;
  book_processing: string;
  book_name_placeholder: string;
  book_phone_placeholder: string;
  book_email_placeholder: string;
  book_hours_selected: string;
  book_max_hours: string;
  book_total: string;

  // Payment pages
  payment_success_title: string;
  payment_success_msg: string;
  payment_fail_title: string;
  payment_fail_msg: string;
  payment_go_home: string;
  payment_try_again: string;

  // Court selection
  book_select_court: string;
  court_1: string;
  court_2: string;
  court_1_desc: string;
  court_2_desc: string;
}

export const translations: Record<Language, Translation> = {
  ka: {
    nav_home: "მთავარი",
    nav_about: "ჩვენ შესახებ",
    nav_book: "დაჯავშნა",
    nav_contact: "კონტაქტი",

    hero_headline: "ჯიპადელი წყნეთში",
    hero_subheadline:
      "ტბილისთან ახლოს, ბუნების გულში — გამოიჩინე ნიჭი პადელის კორტზე",
    hero_cta: "კორტის დაჯავშნა",

    about_title: "ჩვენ შესახებ",
    about_p1:
      "GPadel — ეს არის პადელის პირველი პრემიუმ კომპლექსი წყნეთში, ტბილისიდან მხოლოდ 15 წუთის სავალ მანძილზე. ჩვენი 2 პროფესიული კორტი განთავსებულია ულამაზეს მთის ლანდშაფტში.",
    about_p2:
      "ჩვენ გვთავაზობთ სათამაშო მოედნებს, რომლებიც შეესაბამება საერთაშორისო სტანდარტებს, პროფესიონალური განათებით ღამის თამაშებისთვის, ასევე მოსაწყობ ადგილს მოსვენებისა და სოციალური ღონისძიებებისათვის.",

    courts_title: "ჩვენი კორტები",
    courts_subtitle:
      "ორი სრულად აღჭურვილი პადელის კორტი თქვენი სიამოვნებისთვის",
    court1_name: "კორტი #1",
    court1_desc:
      "პანორამული ხედით — ეს კორტი გთავაზობთ შთამბეჭდავ ხედს წყნეთის ტყეზე. მთლიანი შუშის გვერდები, LED განათება.",
    court2_name: "კორტი #2",
    court2_desc:
      "პანორამული ხედით — ეს კორტი გთავაზობთ შთამბეჭდავ ხედს წყნეთის ტყეზე. მთლიანი შუშის გვერდები, LED განათება.",
    court_per_person: "30₾/საათი",
    court_rental: "80₾/საათი",
    court_book_now: "ახლავე დაჯავშნე",
    court_hour: "ადამიანზე",
    court_features_title: "მახასიათებლები:",
    court_feature_lights: "LED განათება",
    court_feature_surface: "ხელოვნური საფარი",
    court_feature_equipment: "ინვენტარი ხელმისაწვდომია",

    reviews_title: "მიმოხილვები",
    reviews_subtitle: "ჩვენი სტუმრები გვაფასებენ ★★★★★",

    contact_title: "კონტაქტი",
    contact_phone: "ტელეფონი",
    contact_address: "მისამართი",
    contact_hours: "სამუშაო საათები",
    contact_hours_value: "ყოველდღე 09:00 – 02:00",
    contact_map_placeholder: "რუქა",

    footer_rights: "© 2026 GPadel. ყველა უფლება დაცულია.",
    footer_lgbtq: "LGBTQ+ მეგობრული სივრცე",

    book_title: "კორტის დაჯავშნა",
    book_step1: "თარიღი და დრო",
    book_step2: "საკონტაქტო მონაცემები",
    book_step3: "გადახდა",
    book_select_date: "აირჩიეთ თარიღი",
    book_select_time: "აირჩიეთ დრო",
    book_available: "ხელმისაწვდომი",
    book_booked: "დაჯავშნულია",
    book_next: "შემდეგი",
    book_back: "უკან",
    book_your_name: "თქვენი სახელი",
    book_your_phone: "ტელეფონი",
    book_your_email: "ელ-ფოსტა",
    book_players: "მოთამაშეთა რაოდენობა",
    book_players_2: "2 მოთამაშე — 40₾",
    book_players_4: "4 მოთამაშე — 80₾",
    book_payment_method: "გადახდის მეთოდი",
    book_bog: "BOG Pay (საქართველოს ბანკი)",
    book_tbc: "TBC iPay",
    book_summary: "შეკვეთის მიმოხილვა",
    book_summary_date: "თარიღი:",
    book_summary_time: "დრო:",
    book_summary_players: "მოთამაშეები:",
    book_summary_price: "ფასი:",
    book_confirm: "გადახდის დადასტურება",
    book_processing: "მუშავდება...",
    book_name_placeholder: "მაგ: ნინო გელაშვილი",
    book_phone_placeholder: "მაგ: +995 555 123 456",
    book_email_placeholder: "მაგ: nino@example.com",
    book_hours_selected: "{n} საათი არჩეული",
    book_max_hours: "მაქს. 8 საათი",
    book_total: "ჯამი",

    payment_success_title: "გადახდა წარმატებულია!",
    payment_success_msg:
      "თქვენი კორტი დაჯავშნულია. დეტალები გაიგზავნება თქვენს ელ-ფოსტაზე.",
    payment_fail_title: "გადახდა ვერ შესრულდა",
    payment_fail_msg:
      "სამწუხაროდ, გადახდა ვერ შესრულდა. გთხოვთ სცადოთ თავიდან.",
    payment_go_home: "მთავარზე დაბრუნება",
    payment_try_again: "თავიდან სცადე",

    book_select_court: "აირჩიეთ კორტი",
    court_1: "კორტი 1",
    court_2: "კორტი 2",
    court_1_desc: "გარე კორტი",
    court_2_desc: "შიდა კორტი",
  },
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_book: "Book",
    nav_contact: "Contact",

    hero_headline: "GPadel In Tskneti",
    hero_subheadline:
      "Close to Tbilisi, in the heart of nature — unleash your talent on the padel court",
    hero_cta: "Book a Court",

    about_title: "About Us",
    about_p1:
      "GPadel is the first premium padel complex in Tskneti, just 15 minutes from Tbilisi. Our 2 professional courts are set in a stunning mountain landscape.",
    about_p2:
      "We offer playing courts that meet international standards, with professional lighting for night games, as well as a relaxation and social event space.",

    courts_title: "Our Courts",
    courts_subtitle: "Two fully equipped padel courts for your enjoyment",
    court1_name: "Court #1",
    court1_desc:
      "Panoramic view — this court offers a stunning view of the Tskneti forest. Full glass sides, LED lighting.",
    court2_name: "Court #2",
    court2_desc:
      "Enclosed zone — protected from weather changes, this court is perfect in any season. Artificial lighting and climate control.",
    court_per_person: "30₾/hour",
    court_rental: "80₾/hour",
    court_book_now: "Book Now",
    court_hour: "per person",
    court_features_title: "Features:",
    court_feature_lights: "LED Lighting",
    court_feature_surface: "Artificial Surface",
    court_feature_equipment: "Equipment Available",

    reviews_title: "Reviews",
    reviews_subtitle: "Our guests rate us ★★★★★",

    contact_title: "Contact",
    contact_phone: "Phone",
    contact_address: "Address",
    contact_hours: "Working Hours",
    contact_hours_value: "Daily 09:00 – 02:00",
    contact_map_placeholder: "Map",

    footer_rights: "© 2026 GPadel. All rights reserved.",
    footer_lgbtq: "LGBTQ+ Friendly Space",

    book_title: "Book a Court",
    book_step1: "Date & Time",
    book_step2: "Contact Info",
    book_step3: "Payment",
    book_select_date: "Select Date",
    book_select_time: "Select Time Slot",
    book_available: "Available",
    book_booked: "Booked",
    book_next: "Next",
    book_back: "Back",
    book_your_name: "Your Name",
    book_your_phone: "Phone",
    book_your_email: "Email",
    book_players: "Number of Players",
    book_players_2: "2 Players — 40₾",
    book_players_4: "4 Players — 80₾",
    book_payment_method: "Payment Method",
    book_bog: "BOG Pay (Bank of Georgia)",
    book_tbc: "TBC iPay",
    book_summary: "Order Summary",
    book_summary_date: "Date:",
    book_summary_time: "Time:",
    book_summary_players: "Players:",
    book_summary_price: "Price:",
    book_confirm: "Confirm Payment",
    book_processing: "Processing...",
    book_name_placeholder: "e.g. John Smith",
    book_phone_placeholder: "e.g. +995 555 123 456",
    book_email_placeholder: "e.g. john@example.com",
    book_hours_selected: "{n} hours selected",
    book_max_hours: "Max. 8 hours",
    book_total: "Total",

    payment_success_title: "Payment Successful!",
    payment_success_msg:
      "Your court has been booked. Details will be sent to your email.",
    payment_fail_title: "Payment Failed",
    payment_fail_msg:
      "Unfortunately, the payment could not be processed. Please try again.",
    payment_go_home: "Return to Home",
    payment_try_again: "Try Again",

    book_select_court: "Select Court",
    court_1: "Court 1",
    court_2: "Court 2",
    court_1_desc: "Outdoor Court",
    court_2_desc: "Panorama Court",
  },
};

export interface Reservation {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlots: string[]; // HH:MM array (consecutive)
  courtId: 1 | 2;
  name: string;
  phone: string;
  email: string;
  players: 2 | 4;
  price: number;
  paymentMethod: "bog" | "tbc";
  paymentStatus: "pending" | "paid" | "failed";
  orderId?: string;
  createdAt: string;
  blocked?: boolean;
  notes?: string;
}

export interface BookingState {
  step: 1 | 2 | 3;
  date: string;
  timeSlots: string[];
  courtId: 1 | 2;
  name: string;
  phone: string;
  email: string;
  players: 2 | 4;
  paymentMethod: "bog" | "tbc";
}
