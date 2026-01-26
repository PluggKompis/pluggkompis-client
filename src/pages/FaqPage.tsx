import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const FaqPage: React.FC = () => {
  // State to track which FAQ is expanded
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Är detta en verklig tjänst?",
      answer:
        "Nej, PluggKompis är ett studentprojekt skapat som examensarbete vid NBI Handelsakademin i Göteborg. Plattformen är inte en aktiv tjänst och all data här är testdata i demonstrationssyfte.",
    },
    {
      question: "Hur bokar jag en tid för läxhjälp?",
      answer:
        "I den färdiga prototypen navigerar föräldrar till 'Hitta läxhjälp', väljer en plats på kartan eller i listan, klickar på ett lämpligt tillfälle och bokar för sitt registrerade barn. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "Kostar det något att använda plattformen?",
      answer:
        "I det verkliga scenariot skulle all läxhjälp vara helt gratis, vilket är en av grundidéerna med konceptet. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      question: "Vilka ämnen kan man få hjälp med?",
      answer:
        "Plattformen stöder flera skolämnen som matematik, svenska, engelska, NO-ämnen, och samhällskunskap. Varje läxhjälpsplats kan erbjuda olika ämnen beroende på vilka volontärer som finns tillgängliga. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      question: "Vem kan bli volontär?",
      answer:
        "I det tänkta systemet skulle volontärer kunna vara universitetsstudenter, pensionerade lärare, eller andra med kunskap som vill hjälpa till. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      question: "Hur hanteras personuppgifter och GDPR?",
      answer:
        "Detta är ett studentprojekt med enbart testdata. I en verklig implementation skulle fullständig GDPR-efterlevnad vara implementerad med krypterade lösenord, säker datalagring, och användarens rätt till radering. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    },
    {
      question: "Vilken teknik är plattformen byggd med?",
      answer:
        "Frontend är byggd med React 18, TypeScript och Tailwind CSS. Backend använder ASP.NET Core 8 med Clean Architecture, Entity Framework Core, och Azure SQL. Autentisering hanteras med JWT-tokens och rollbaserad åtkomst. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
    },
    {
      question: "Kan jag använda koden i mitt eget projekt?",
      answer:
        "Detta projekt är skapat i utbildningssyfte. Kod och koncept kan inspirera, men vi rekommenderar att du skapar din egen lösning från grunden för att få maximal läroeffekt. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
    },
  ];

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8">Vanliga frågor</h1>

      <div className="mx-auto max-w-3xl space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-neutral-50"
              aria-expanded={expandedIndex === index}
            >
              <h3 className="pr-8 font-semibold text-neutral-700">{faq.question}</h3>
              {expandedIndex === index ? (
                <ChevronUp className="h-5 w-5 flex-shrink-0 text-primary-600" />
              ) : (
                <ChevronDown className="h-5 w-5 flex-shrink-0 text-neutral-400" />
              )}
            </button>
            {expandedIndex === index && (
              <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-4">
                <p className="text-neutral-secondary">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
