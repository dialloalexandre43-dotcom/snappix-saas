"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How does it actually work?",
    answer:
      "Paste any AliExpress or Amazon product URL. Our AI scrapes the listing, extracts the images, removes backgrounds, and generates professional product visuals -- all in under 10 seconds. No Photoshop required.",
    tag: "How it works",
  },
  {
    question: "Does it work with any product?",
    answer:
      "Yes. Clothing, cosmetics, electronics, jewelry, food, furniture... Our model was trained on millions of e-commerce products. Results are optimized for each category.",
    tag: "Products",
  },
  {
    question: "What export formats are available?",
    answer:
      "PNG (transparent background), JPG and WebP. We automatically generate sizes for Amazon (1000x1000, 2000x2000), Shopify (2048x2048), Instagram (1080x1080) or your custom dimensions. Batch export is available.",
    tag: "Export",
  },
  {
    question: "Are my images kept private?",
    answer:
      "100%. Encryption in transit and at rest, EU-based servers, full GDPR compliance. Your images are never used to train our models. Deletion on request at any time.",
    tag: "Security",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "No commitment. Cancel in 2 clicks from your dashboard. Access stays active until the end of your paid period. Zero hidden fees.",
    tag: "Billing",
  },
  {
    question: "Is the API available on all plans?",
    answer:
      "The API is included in the Pro plan. It lets you automate processing from your ERP, CMS, or internal workflow. Full documentation, Node.js and Python SDKs, and dev support included.",
    tag: "API",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: (typeof faqs)[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full text-left rounded-xl border transition-all duration-200 ${
        isOpen
          ? "bg-card border-accent/25 shadow-sm shadow-accent/5"
          : "bg-card/60 border-border hover:border-border/80 hover:bg-card"
      } ${isEven ? "p-5 sm:p-6" : "p-5 sm:px-7 sm:py-6"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <span
              className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                isOpen
                  ? "bg-accent/10 text-accent"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {faq.tag}
            </span>
          </div>
          <h3
            className={`font-medium text-base sm:text-[17px] leading-snug ${
              isOpen ? "text-foreground" : "text-foreground/85"
            }`}
          >
            {faq.question}
          </h3>
          <div
            className={`grid transition-all duration-200 ${
              isOpen ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-muted-foreground text-sm leading-relaxed pr-6">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? "bg-accent/10 rotate-180"
              : "bg-muted"
          }`}
        >
          <ChevronDown
            className={`w-4 h-4 ${
              isOpen ? "text-accent" : "text-muted-foreground"
            }`}
          />
        </div>
      </div>
    </button>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm font-medium text-accent mb-3 uppercase tracking-wider">
            FAQ
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4 text-balance">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Answers to the most common questions we get.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid md:grid-cols-2 gap-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 p-5 rounded-xl border border-dashed border-border bg-card/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-foreground">
              Can't find your answer?
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Our team responds in under 2 hours on weekdays.
            </p>
          </div>
          <a
            href="mailto:support@pixely.io"
            className="text-sm font-medium text-accent hover:underline underline-offset-4 whitespace-nowrap"
          >
            Contact support
          </a>
        </div>
      </div>
    </section>
  );
}

