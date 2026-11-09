create table profiles (id uuid primary key references auth.users on delete cascade, full_name text, phone text, role text not null default 'customer' check (role in ('customer','admin')), created_at timestamptz default now());
create function is_admin() returns boolean language sql security definer stable as $$ select exists(select 1 from profiles where id = auth.uid() and role='admin') $$;
create function handle_new_user() returns trigger language plpgsql security definer as $$ begin insert into profiles(id, full_name) values (new.id, new.raw_user_meta_data->>'full_name'); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create table categories (id serial primary key, name text not null, slug text unique not null, parent_id int references categories);
create table brands (id serial primary key, name text not null, slug text unique not null);
create table products (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, description text, category_id int references categories, brand_id int references brands, base_price numeric(12,2) not null, sale_price numeric(12,2), is_active boolean default true, popularity int default 0, created_at timestamptz default now());
create table product_variants (id uuid primary key default gen_random_uuid(), product_id uuid references products on delete cascade, size text, color text, stock int not null default 0, price numeric(12,2));
create table product_images (id uuid primary key default gen_random_uuid(), product_id uuid references products on delete cascade, url text not null, position int default 0);

create table addresses (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users on delete cascade, full_name text, phone text, line1 text, city text, state text);
create table carts (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users on delete cascade);
create table cart_items (id uuid primary key default gen_random_uuid(), cart_id uuid references carts on delete cascade, variant_id uuid references product_variants, qty int not null default 1);
create table wishlists (user_id uuid references auth.users on delete cascade, product_id uuid references products on delete cascade, primary key (user_id, product_id));
create table orders (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users, email text, status text not null default 'pending' check (status in ('pending','paid','processing','shipped','delivered','cancelled','refunded')), total numeric(12,2) not null, delivery_fee numeric(12,2) default 0, shipping jsonb, payment_ref text unique, created_at timestamptz default now());
create table order_items (id uuid primary key default gen_random_uuid(), order_id uuid references orders on delete cascade, variant_id uuid references product_variants, name text, size text, qty int, unit_price numeric(12,2));
create table reviews (id uuid primary key default gen_random_uuid(), product_id uuid references products on delete cascade, user_id uuid references auth.users, rating int check (rating between 1 and 5), body text, created_at timestamptz default now());
create table contact_messages (id uuid primary key default gen_random_uuid(), name text, email text, message text, created_at timestamptz default now());
create table newsletter_subscribers (email text primary key, created_at timestamptz default now());

do $$ declare t text; begin
  foreach t in array array['profiles','categories','brands','products','product_variants','product_images','addresses','carts','cart_items','wishlists','orders','order_items','reviews','contact_messages','newsletter_subscribers'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "admin all" on %I for all using (is_admin()) with check (is_admin())', t);
  end loop;
  foreach t in array array['categories','brands','products','product_variants','product_images','reviews'] loop
    execute format('create policy "public read" on %I for select using (true)', t);
  end loop;
  foreach t in array array['addresses','carts','orders','profiles'] loop
    execute format('create policy "own rows" on %I for select using (%s = auth.uid())', t, case when t='profiles' then 'id' else 'user_id' end);
  end loop;
end $$;
create policy "own addresses write" on addresses for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own cart write" on carts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own cart items" on cart_items for all using (exists(select 1 from carts c where c.id=cart_id and c.user_id=auth.uid()));
create policy "own wishlist" on wishlists for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own order items" on order_items for select using (exists(select 1 from orders o where o.id=order_id and o.user_id=auth.uid()));
create policy "own reviews write" on reviews for insert with check (user_id = auth.uid());
create policy "public contact" on contact_messages for insert with check (true);
create policy "public newsletter" on newsletter_subscribers for insert with check (true);

insert into storage.buckets (id, name, public) values ('product-images','product-images',true) on conflict do nothing;
create policy "public read images" on storage.objects for select using (bucket_id='product-images');
create policy "admin write images" on storage.objects for all using (bucket_id='product-images' and is_admin()) with check (bucket_id='product-images' and is_admin());
