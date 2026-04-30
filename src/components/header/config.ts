export type NavItem = {
  id: string;
  labelKey: string;
  href: string;
};

export const navItems: NavItem[] = [
  { id: 'men', labelKey: 'nav.men', href: '/men' },
  { id: 'women', labelKey: 'nav.women', href: '/women' },
  { id: 'new', labelKey: 'nav.new', href: '/new' },
  { id: 'drops', labelKey: 'nav.drops', href: '/drops' },
  { id: 'sale', labelKey: 'nav.sale', href: '/sale' },
  { id: 'products', labelKey: 'nav.products', href: '/products' },
];

export type UserMenuOption = {
  id: string;
  labelKey: string;
};

export const userMenuOptions: UserMenuOption[] = [
  { id: 'profile', labelKey: 'user.profile' },
  { id: 'orders', labelKey: 'user.orders' },
  { id: 'logout', labelKey: 'user.logout' },
];
