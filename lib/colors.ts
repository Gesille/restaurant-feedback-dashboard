// Central color system, matched to the approved brand palette.
// Background stays white everywhere except the sidebar, which is "ink".
export const ink = {
  base: "#1A1730",
  soft: "#28234A",
  softer: "#241F44",
  muted: "#6E6890",
  mutedLight: "#A79EE0",
  border: "#EDEBF7",
  panel: "#FBFAFF",
};

export const brand = {
  violet: {
    solid: "#6C4DF4",
    dark: "#4E2FD9",
    soft: "bg-[#F1EDFF]",
    text: "text-[#6C4DF4]",
    ring: "ring-[#EDE8FF]",
    grad: "from-[#6C4DF4] to-[#8C6BFF]",
    chip: "bg-[#F1EDFF] text-[#6C4DF4]",
  },
  teal: {
    solid: "#00BFA6",
    soft: "bg-[#E1F9F2]",
    text: "text-[#00BFA6]",
    ring: "ring-[#D7F5EC]",
    grad: "from-[#00BFA6] to-[#00D9BC]",
    chip: "bg-[#E1F9F2] text-[#0A9E7A]",
  },
  coral: {
    solid: "#FF6B6B",
    soft: "bg-[#FFEBEB]",
    text: "text-[#FF6B6B]",
    ring: "ring-[#FFE1E1]",
    grad: "from-[#FF6B6B] to-[#FF8E8E]",
    chip: "bg-[#FFEBEB] text-[#E14848]",
  },
  amber: {
    solid: "#FFA63D",
    soft: "bg-[#FFF3E4]",
    text: "text-[#C97A0E]",
    ring: "ring-[#FFEBCF]",
    grad: "from-[#FFA63D] to-[#FFC069]",
    chip: "bg-[#FFF3E4] text-[#C97A0E]",
  },
  blue: {
    solid: "#3D8BFF",
    soft: "bg-[#E9F1FF]",
    text: "text-[#3D8BFF]",
    ring: "ring-[#DCEAFF]",
    grad: "from-[#3D8BFF] to-[#6BA8FF]",
    chip: "bg-[#E9F1FF] text-[#2E6FDB]",
  },
  pink: {
    solid: "#F651A8",
    soft: "bg-[#FFEAF6]",
    text: "text-[#F651A8]",
    ring: "ring-[#FFDDF0]",
    grad: "from-[#F651A8] to-[#FF85C4]",
    chip: "bg-[#FFEAF6] text-[#D6338C]",
  },
  slate: {
    solid: "#6B6685",
    soft: "bg-[#F1EFFA]",
    text: "text-[#6B6685]",
    ring: "ring-[#EDEBF7]",
    grad: "from-[#6B6685] to-[#9C97B5]",
    chip: "bg-[#F1EFFA] text-[#6B6685]",
  },
} as const;

export type BrandColor = keyof typeof brand;
