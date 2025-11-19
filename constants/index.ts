import CartEmptyIcon from "@/assets/icons/cart-empty.svg";
import CartIcon from "@/assets/icons/cart.svg";
import DirectLeftIcon from "@/assets/icons/direct-left.svg";
import HomeIcon from "@/assets/icons/home.svg";
import LogoIcon from "@/assets/icons/logo.svg";
import LogoutIcon from "@/assets/icons/logout.svg";

export const images = {
  LogoIcon,
  LogoutIcon,
  CartIcon,
  HomeIcon,
  CartEmptyIcon,
  DirectLeftIcon,
};

export const PAGINATION_DEFAULT = {
  page: 1,
  limit: 3,
};

export const FIVE_MINUTES = 1000 * 60 * 5;

export const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Shipping typically takes 3–5 business days within the country. International orders may take up to 14 business days.",
  },
  {
    question: "Can I return an item?",
    answer:
      "Yes, you can return any unused item within 7 days of delivery. Please ensure it is in its original packaging.",
  },
  {
    question: "Do you offer bulk purchase discounts?",
    answer:
      "Absolutely! Contact our sales team for discounted pricing on bulk orders.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking link via email. You can also check your order status in your account dashboard.",
  },
];
