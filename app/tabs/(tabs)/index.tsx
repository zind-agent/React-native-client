import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <Center className="flex-1">
      <Heading>{t("home")}</Heading>
      <Text className="text-xl">{t("welcome to home")}</Text>
    </Center>
  );
}
