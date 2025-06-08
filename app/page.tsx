"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Download } from "lucide-react";

const products = [
  {
    id: 1,
    title: "E-book: Come Vendere Online",
    description: "Guida pratica per iniziare a vendere prodotti digitali.",
    price: 9.99,
    fileUrl: "/files/ebook1.pdf",
    stripePriceId: "price_1OeXXXXX1234567890abcd"
  },
  {
    id: 2,
    title: "Template CV Professionale",
    description: "Modello editabile in Word e Google Docs.",
    price: 4.99,
    fileUrl: "/files/cv-template.docx",
    stripePriceId: "price_1OeYYYYY1234567890abcd"
  },
];

export default function DigitalStore() {
  const [user, setUser] = useState(null);
  const [purchased, setPurchased] = useState([]);
  const [referrer, setReferrer] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref") || localStorage.getItem("referrer");
    if (ref) {
      setReferrer(ref);
      localStorage.setItem("referrer", ref);
    }
  }, []);

  const handleLogin = () => {
    const fakeUser = {
      id: "user123",
      name: "Mario Rossi",
      email: "mario@example.com",
      referredBy: referrer || null,
    };
    setUser(fakeUser);
  };

  const handleLogout = () => {
    setUser(null);
    setPurchased([]);
  };

  const handleStripeCheckout = async (product) => {
    if (!user) {
      alert("Effettua il login per acquistare.");
      return;
    }

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        priceId: product.stripePriceId,
        userId: user.id,
        referrer: user.referredBy,
        productId: product.id,
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Errore nella creazione della sessione di pagamento.");
    }
  };

  const handleDownload = (product) => {
    if (!purchased.includes(product.id)) {
      alert("Devi acquistare il prodotto prima di scaricarlo.");
      return;
    }
    window.open(product.fileUrl, "_blank");
  };

  const referralLink = user ? `${window.location.origin}?ref=${user.id}` : null;

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Digital Store</h1>
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <div>Ciao, {user.name}</div>
              <div className="text-xs text-gray-500">
                Ref link: <a href={referralLink} className="text-blue-500 underline">{referralLink}</a>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <Button onClick={handleLogin}>Login</Button>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {products.map((product) => (
          <Card key={product.id} className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-semibold">€{product.price}</span>
                {!purchased.includes(product.id) ? (
                  <Button onClick={() => handleStripeCheckout(product)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Acquista con Carta
                  </Button>
                ) : (
                  <Button onClick={() => handleDownload(product)} variant="secondary">
                    <Download className="mr-2 h-4 w-4" /> Scarica
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
