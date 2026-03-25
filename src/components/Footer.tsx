import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <h3 className="text-xl font-display font-light tracking-widest mb-4">
              Душа природы
            </h3>
            <p className="text-sm opacity-60 font-body leading-relaxed">
              Украшения из натуральных камней, созданные с любовью к природе и её красоте
            </p>
            <div className="flex gap-3 mt-5">
              <a href="http://t.me/amulet1819" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" title="Telegram">
                <Icon name="Send" size={16} />
              </a>
              <a href="https://vk.com/prostorenergii" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-background/20 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity" title="ВКонтакте">
                <Icon name="Users" size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-body font-medium tracking-widest uppercase opacity-50 mb-4">Магазин</h4>
            <ul className="space-y-2">
              {[
                { to: "/catalog", label: "Каталог" },
                { to: "/constructor", label: "Конструктор" },
                { to: "/cart", label: "Корзина" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm opacity-70 hover:opacity-100 transition-opacity font-body">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-body font-medium tracking-widest uppercase opacity-50 mb-4">Компания</h4>
            <ul className="space-y-2">
              {[
                { to: "/about", label: "О нас" },
                { to: "/delivery", label: "Доставка и оплата" },
                { to: "/reviews", label: "Отзывы" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm opacity-70 hover:opacity-100 transition-opacity font-body">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-body font-medium tracking-widest uppercase opacity-50 mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Icon name="Mail" size={14} />
                <span className="font-body">lida.tetyush@mail.ru</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Icon name="Phone" size={14} />
                <span className="font-body">+7 (961) 072-86-42</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Icon name="Phone" size={14} />
                <span className="font-body">+7 (961) 076-39-87</span>
              </li>
              <li className="flex items-center gap-2 text-sm opacity-70">
                <Icon name="MapPin" size={14} />
                <span className="font-body">Москва, Россия</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs opacity-40 font-body">© 2024 Душа природы. Все права защищены</p>
          <p className="text-xs opacity-40 font-body">Натуральные камни • Ручная работа • С любовью</p>
        </div>
      </div>
    </footer>
  );
}