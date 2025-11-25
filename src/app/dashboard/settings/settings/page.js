"use client";
import * as React from "react";
import SocialAccountsCard from "@/components/settings/SocialAccountsCard";
import LanguageCard from "@/components/settings/LanguageCard";
import PrivacyCard from "@/components/settings/PrivacyCard";
import PrivacyDetails from "@/components/settings/PrivacyDetails";
import DeleteAccountCard from "@/components/settings/DeleteAccountCard";

export default function SettingsTabPage() {
  const [privacyOpen, setPrivacyOpen] = React.useState(false);
  const [lang, setLang] = React.useState("ar");
  const languages = [
    { value: "ar", label: "العربية" },
    { value: "en", label: "English" },
  ];
  return (
    <div className="space-y-6">
      <SocialAccountsCard />
      <LanguageCard value={lang} onChange={setLang} languages={languages} />
      <PrivacyCard onOpen={() => setPrivacyOpen(true)} />
      <PrivacyDetails open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <DeleteAccountCard />
    </div>
  );
}