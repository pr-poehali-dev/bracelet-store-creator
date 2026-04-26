import { useState } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

interface Order {
  id: number;
  name: string;
  phone: string;
  comment: string;
  items: { name: string; quantity: number; price: number }[];
  total_price: number;
  status: string;
  payment_status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:       { label: "Новый",      color: "bg-blue-100 text-blue-700" },
  confirmed: { label: "Подтверждён", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Отменён",    color: "bg-red-100 text-red-700" },
  completed: { label: "Выполнен",   color: "bg-purple-100 text-purple-700" },
};

const PAYMENT_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "Не оплачен", color: "bg-yellow-100 text-yellow-700" },
  succeeded: { label: "Оплачен",    color: "bg-green-100 text-green-700" },
  canceled:  { label: "Отменён",    color: "bg-red-100 text-red-700" },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" })
    + " " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(func2url["cart-order"], {
        headers: { "X-Admin-Password": password },
      });
      if (res.status === 401) {
        setError("Неверный пароль");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setAuthed(true);
    } catch {
      setError("Ошибка соединения");
    }
    setLoading(false);
  }

  const filtered = filterStatus === "all"
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const totalSum = filtered.reduce((s, o) => s + o.total_price, 0);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <Icon name="ShieldCheck" size={40} className="mx-auto text-amber-700 mb-3" />
            <h1 className="text-2xl font-semibold text-stone-800">Администратор</h1>
            <p className="text-stone-500 text-sm mt-1">Введите пароль для входа</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="Пароль"
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-300 mb-3"
          />
          {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
          <button
            onClick={login}
            disabled={loading || !password}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white rounded-xl py-3 font-medium transition disabled:opacity-50"
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Шапка */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-stone-800">Заказы</h1>
            <p className="text-stone-500 text-sm mt-0.5">Всего: {orders.length} заказов</p>
          </div>
          <button
            onClick={() => setAuthed(false)}
            className="text-stone-400 hover:text-stone-600 flex items-center gap-1 text-sm"
          >
            <Icon name="LogOut" size={16} />
            Выйти
          </button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Всего заказов", value: orders.length, icon: "ShoppingBag" },
            { label: "Новых", value: orders.filter(o => o.status === "new").length, icon: "Bell" },
            { label: "Оплачено", value: orders.filter(o => o.payment_status === "succeeded").length, icon: "CreditCard" },
            { label: "Сумма (фильтр)", value: totalSum.toLocaleString("ru-RU") + " ₽", icon: "Wallet" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm">
              <Icon name={s.icon} size={20} className="text-amber-600 mb-2" />
              <div className="text-xl font-bold text-stone-800">{s.value}</div>
              <div className="text-xs text-stone-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Фильтр */}
        <div className="flex gap-2 flex-wrap mb-5">
          {[["all", "Все"], ["new", "Новые"], ["confirmed", "Подтверждённые"], ["cancelled", "Отменённые"]].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setFilterStatus(v)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filterStatus === v ? "bg-amber-700 text-white" : "bg-white text-stone-600 hover:bg-stone-100"}`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Список заказов */}
        <div className="space-y-3">
          {filtered.map(order => {
            const st = STATUS_LABELS[order.status] || { label: order.status, color: "bg-stone-100 text-stone-600" };
            const pay = PAYMENT_LABELS[order.payment_status] || { label: order.payment_status, color: "bg-stone-100 text-stone-600" };
            const isOpen = expanded === order.id;

            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full text-left px-5 py-4 flex items-center gap-3"
                >
                  <div className="text-stone-400 text-sm font-mono w-8">#{order.id}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-stone-800">{order.name}</div>
                    <div className="text-stone-400 text-sm">{order.phone}</div>
                  </div>
                  <div className="hidden sm:block text-right mr-4">
                    <div className="font-semibold text-stone-800">{order.total_price.toLocaleString("ru-RU")} ₽</div>
                    <div className="text-xs text-stone-400">{formatDate(order.created_at)}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${st.color}`}>{st.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${pay.color}`}>{pay.label}</span>
                  <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-stone-400 ml-1 flex-shrink-0" />
                </button>

                {isOpen && (
                  <div className="border-t border-stone-100 px-5 py-4">
                    <div className="sm:hidden text-sm text-stone-500 mb-3">{formatDate(order.created_at)}</div>
                    {order.comment && (
                      <p className="text-sm text-stone-600 mb-3 italic">💬 {order.comment}</p>
                    )}
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-stone-700">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-stone-800 pt-2 border-t border-stone-100">
                      <span>Итого</span>
                      <span>{order.total_price.toLocaleString("ru-RU")} ₽</span>
                    </div>
                    <a
                      href={`tel:${order.phone}`}
                      className="mt-3 inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 font-medium"
                    >
                      <Icon name="Phone" size={14} />
                      Позвонить {order.phone}
                    </a>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-stone-400">
              <Icon name="PackageOpen" size={40} className="mx-auto mb-3" />
              <p>Заказов пока нет</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}