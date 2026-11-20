# Next.js Enterprise App Template

A clean, production-ready Next.js starter template designed for modern web applications. Pre-configured with a responsive application layout, customizable theme system, static authentication, and the feature-rich `ReusableTable` component.

---

## 🚀 Features

- **Application Layout**:
  - **Header**: Responsive navbar with search, notifications, theme mode switcher (Light/Dark/System), color palette selector, and user profile dropdown.
  - **Sidebar & Navigation**: Collapsible sidebar with smooth Framer Motion animations, nested submenus, and tooltips.
  - **Footer**: Clean, customizable footer with version and copyright information.
- **Static Authentication**:
  - High-fidelity login screen with animated brand visuals.
  - Fully static authentication out-of-the-box (no external backend required).
  - Pre-filled with demo credentials (`admin` / `password123`).
  - Forgot password & OTP verification flow running with simulated delays.
- **ReusableTable**:
  - Dynamic column configuration (`ColumnConfig<T>`).
  - Column sorting, searching, pagination, and multi-row selection.
  - Interactive gear icon modal to toggle column visibility and drag-reorder columns.
  - Native Excel/CSV export capabilities.
- **Data Fetching & Query Architecture**:
  - **RTK Query**: Ready for feature slices via `baseApi.injectEndpoints({ ... })`.
  - **REST / TanStack Query**: Generic `fetchFromApi` utility for custom `useQuery` / `useMutation` hooks.
- **UI Kit**:
  - Complete shadcn/ui component library styled with Tailwind CSS.
  - Sonner toast notifications pre-configured.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── (authenticated)/      # Protected routes wrapped in main app shell
│   │   ├── forms/            # Form template with inputs, validation & selects
│   │   ├── profile/          # User profile view and edit form
│   │   ├── settings/         # Theme preferences & workspace settings
│   │   ├── tables/           # Full-page ReusableTable showcase
│   │   ├── layout.tsx        # Shell rendering Header, Sidebar, ThemePanel, Footer
│   │   └── page.tsx          # Overview dashboard with KPI cards and charts
│   ├── login/                # Authentication page with static login
│   │   └── forgot-password/  # Static OTP & password reset flow
│   ├── layout.tsx            # Root HTML layout with Redux & Theme providers
│   └── not-found.tsx         # 404 handler
├── components/
│   ├── layout/               # Header, Footer, Sidebar, Navigation, NavLink, ThemePanel
│   └── ui/                   # ReusableTable and shadcn/ui components
├── hooks/                    # usePermission, useDebounce, usePeriodFilter
├── lib/                      # cn utility (clsx + tailwind-merge)
├── service/                  # baseApi (RTK Query), apiClient (fetchFromApi), sampleApi
├── store/                    # Redux store, authSlice, layoutSlice, useAuthStore, useStore
├── types/                    # Shared TypeScript interfaces
└── utils/                    # Formatters (currency, dates)
```

---

## 🔑 Authentication (Static Mode)

The login page runs statically so you can develop UI and test workflows immediately without spinning up a backend API.

- **Username**: `admin`
- **Password**: `password123`
- Click **Sign In** to immediately access the authenticated dashboard.
- Clicking **Log out** in the profile dropdown clears session credentials and redirects back to `/login`.

---

## 📊 Using the ReusableTable Component

Import `ReusableTable` and define your column configuration:

```tsx
import { ReusableTable, ColumnConfig } from '@/components/ui/ReusableTable';

interface Product {
  id: string;
  name: string;
  price: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const columns: ColumnConfig<Product>[] = [
  { key: 'id', header: 'ID', sortable: true, width: '100px' },
  { key: 'name', header: 'Product Name', sortable: true },
  { key: 'price', header: 'Price', sortable: true, align: 'right' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <span className="badge">{row.status}</span>,
  },
];

export default function MyTablePage() {
  return (
    <ReusableTable
      columns={columns}
      data={myData}
      initialPageSize={10}
      showGear={true}
      selectable={true}
      title="Product Catalog"
    />
  );
}
```

---

## 🌐 Connecting APIs

When you're ready to integrate your real backend:

1. Set your backend base URL in `.env`:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   ```
2. Inject endpoints in `src/service/api/`:
   ```ts
   import { baseApi } from '@/service/baseApi';

   export const projectApi = baseApi.injectEndpoints({
     endpoints: (builder) => ({
       getProjects: builder.query<Project[], void>({
         query: () => 'projects/',
         providesTags: ['Items'],
       }),
     }),
   });

   export const { useGetProjectsQuery } = projectApi;
   ```

---

## 🛠️ Quick Start

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Production build
npm run build
```
