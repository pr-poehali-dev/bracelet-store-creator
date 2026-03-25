const IMG1 = "https://cdn.poehali.dev/projects/c1d32ac7-1d0a-4ede-9952-f86391eda1c4/files/2e63867b-30e0-48ae-83b0-bd07c4373652.jpg";

const TEAM = [
  { name: "Алёна Соколова", role: "Основатель и мастер", text: "10 лет работаю с камнями. Каждый браслет — это моя медитация и любовь." },
  { name: "Мария Кузнецова", role: "Мастер по украшениям", text: "Работаю с тонкими техниками плетения и нестандартными сочетаниями камней." },
  { name: "Дарья Петрова", role: "Куратор коллекции", text: "Подбираю камни у проверенных поставщиков, слежу за качеством и подлинностью." },
];

const VALUES = [
  { emoji: "🌿", title: "Экологичность", text: "Используем переработанную упаковку и бережно относимся к природе" },
  { emoji: "💎", title: "Подлинность", text: "Все камни имеют сертификаты и проверены геологами" },
  { emoji: "❤️", title: "С любовью", text: "Каждое украшение создаётся с намерением и положительной энергией" },
  { emoji: "🤝", title: "Честность", text: "Рассказываем всё о составе, происхождении и свойствах камней" },
];

export default function About() {
  return (
    <main>
      {/* Hero */}
      <section className="hero-section py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-display font-light text-foreground leading-tight mb-6">
                История<br /><em>нашего магазина</em>
              </h1>
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                Душа природы родилась в 2019 году из страсти к минералам и желания делать украшения, которые несут смысл. Мы верим, что каждый камень выбирает своего человека.
              </p>
              <p className="text-muted-foreground font-body leading-relaxed">
                Сегодня мы — небольшая команда мастеров из Москвы, которая создаёт украшения ручной работы из сертифицированных натуральных камней. Каждый браслет, ожерелье или кольцо — это уникальный предмет с душой.
              </p>
            </div>
            <div>
              <img
                src={IMG1}
                alt="Наша мастерская"
                className="w-full h-80 object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Цифры */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "5+", label: "Лет на рынке" },
              { num: "2400+", label: "Довольных клиентов" },
              { num: "16+", label: "Видов камней" },
              { num: "100%", label: "Натуральные камни" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-4xl md:text-5xl font-display font-light text-primary mb-1">{s.num}</p>
                <p className="text-sm font-body text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Команда */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display font-light text-foreground">Наша команда</h2>
            <div className="section-divider" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-display text-primary">{member.name[0]}</span>
                </div>
                <h3 className="font-display text-xl mb-1 text-foreground">{member.name}</h3>
                <p className="text-xs font-body text-primary uppercase tracking-widest mb-3">{member.role}</p>
                <p className="text-sm font-body text-muted-foreground leading-relaxed">«{member.text}»</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ценности */}
      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display font-light text-background">Наши ценности</h2>
            <div className="section-divider" />
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="text-center p-4">
                <div className="text-4xl mb-3">{v.emoji}</div>
                <h3 className="font-display text-xl text-background mb-2">{v.title}</h3>
                <p className="text-sm font-body text-background/60 leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}