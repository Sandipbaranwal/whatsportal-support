import { CustomizeScreen } from "@/components/customize/customize-screen";

export const metadata = {
  title: "Customize — WhatsPortal Support",
  description:
    "Brand the WhatsPortal customer-support chat widget: logo, colour, greeting and suggested replies.",
};

export default function CustomizePage() {
  return (
    <main className="flex flex-1 flex-col">
      <CustomizeScreen />
    </main>
  );
}
