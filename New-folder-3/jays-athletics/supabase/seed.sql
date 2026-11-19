insert into categories (name, slug) values ('Football Cleats','football-cleats'),('Sports Shoes','sports-shoes'),('Kits & Jerseys','kits-jerseys'),('Sportswear','sportswear'),('Accessories','accessories'),('Kids','kids'),('Sale','sale');
insert into brands (name, slug) values ('Nike','nike'),('Adidas','adidas'),('Puma','puma');
-- Starter products; Claude Code will expand this to 24+ (see docs/BUILD_PROMPT.md).
insert into products (name, slug, description, category_id, brand_id, base_price) values
('Pro FG Football Cleats','pro-fg-cleats','Firm-ground cleats.',1,1,45000),
('Turf Trainer Cleats','turf-trainer-cleats','Artificial turf cleats.',1,2,38000),
('Road Runner Shoes','road-runner-shoes','Cushioned running shoes.',2,3,32000);
insert into product_variants (product_id, size, color, stock) select id, s, 'Black', 10 from products, unnest(array['40','41','42','43','44']) s;
