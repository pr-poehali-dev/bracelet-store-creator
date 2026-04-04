import Icon from "@/components/ui/icon";

const DELIVERY_METHODS = [
  {
    icon: "Package",
    title: "Почта России",
    time: "5–14 рабочих дней",
    price: "250 ₽",
    desc: "Отправка 1-го класса, трек-номер для отслеживания",
  },
  {
    icon: "Truck",
    title: "СДЭК",
    time: "2–7 рабочих дней",
    price: "от 300 ₽",
    desc: "Доставка до двери или в пункт выдачи СДЭК",
  },
  {
    icon: "MapPin",
    title: "Самовывоз",
    time: "В день заказа",
    price: "Бесплатно",
    desc: "Камышин и Пенза — договоримся о времени через мессенджер",
  },
];

const PAYMENT_METHODS = [
  { icon: "CreditCard", title: "Банковская карта", desc: "Visa, Mastercard, МИР — онлайн оплата на сайте" },
  { icon: "Smartphone", title: "СБП", desc: "Система быстрых платежей — мгновенный перевод" },
  { icon: "Wallet", title: "ЮMoney", desc: "Электронный кошелёк ЮMoney" },
];

const FAQS = [
  { q: "Когда отправляют заказ?", a: "Готовые изделия отправляем в течение 1–2 рабочих дней. Украшения по индивидуальному дизайну — 3–5 рабочих дней." },
  { q: "Как проверить статус заказа?", a: "После отправки мы пришлём трек-номер на вашу почту или в Telegram. Вы сможете отследить посылку онлайн." },
  { q: "Что делать если пришло не то?", a: "Напишите нам в течение 5 дней после получения, пришлите фото — обменяем или вернём деньги без вопросов." },
  { q: "Возможна ли доставка за рубеж?", a: "Да, отправляем в Беларусь, Казахстан и другие страны СНГ. Уточняйте стоимость при оформлении заказа." },
];

export default function Delivery() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-10">
        <h1 className="text-5xl font-display font-light text-foreground mb-2">Доставка и оплата</h1>
        <div className="section-divider mx-0 mb-4" />
        <p className="text-muted-foreground font-body">Привезём ваше украшение в любую точку России и СНГ</p>
      </div>

      {/* Бесплатная доставка */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-5 mb-10 flex items-center gap-4">
        <Icon name="Gift" size={28} className="text-primary flex-shrink-0" />
        <div>
          <p className="font-body font-medium text-foreground">Бесплатная доставка при заказе от 5 000 ₽</p>
          <p className="text-sm font-body text-muted-foreground">Действует для доставки Почтой России и СДЭК по всей России</p>
        </div>
      </div>

      {/* Способы доставки */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-light text-foreground mb-6">Способы доставки</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {DELIVERY_METHODS.map(m => (
            <div key={m.title} className="bg-card border border-border rounded-2xl p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon name={m.icon as "Package" | "Truck" | "MapPin"} size={22} className="text-primary" />
              </div>
              <h3 className="font-display text-xl mb-1 text-foreground">{m.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-body text-muted-foreground">{m.time}</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-sm font-body font-medium text-primary">{m.price}</span>
              </div>
              <p className="text-sm font-body text-muted-foreground leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Способы оплаты */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-light text-foreground mb-6">Способы оплаты</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {PAYMENT_METHODS.map(m => (
            <div key={m.title} className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Icon name={m.icon as "CreditCard" | "Smartphone" | "Wallet"} size={18} className="text-foreground" />
              </div>
              <div>
                <h3 className="font-body font-medium text-foreground mb-1">{m.title}</h3>
                <p className="text-xs font-body text-muted-foreground leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12">
        <h2 className="text-3xl font-display font-light text-foreground mb-6">Частые вопросы</h2>
        <div className="space-y-3">
          {FAQS.map(faq => (
            <details key={faq.q} className="group bg-card border border-border rounded-2xl">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="font-body font-medium text-foreground">{faq.q}</span>
                <Icon name="ChevronDown" size={18} className="text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5">
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Контакты */}
      <section className="bg-secondary/30 rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-display font-light text-foreground mb-3">Есть вопросы?</h2>
        <p className="text-muted-foreground font-body mb-1">Напишите нам — ответим в течение часа в рабочее время</p>
        <p className="text-sm font-body text-muted-foreground mb-5">ИНН: 343657054080</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="mailto:lida.tetyush@mail.ru" className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-body hover:opacity-90 transition-opacity">
            <Icon name="Mail" size={16} />
            lida.tetyush@mail.ru
          </a>
          <a href="https://t.me/zemlyakamen" className="flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-full text-sm font-body hover:bg-secondary transition-colors">
            <Icon name="Send" size={16} />
            Telegram
          </a>
        </div>
      </section>
    </main>
  );
}