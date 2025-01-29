-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Clean up product-related tables
DELETE FROM catalog_product_entity;
DELETE FROM catalog_product_entity_datetime;
DELETE FROM catalog_product_entity_decimal;
DELETE FROM catalog_product_entity_gallery;
DELETE FROM catalog_product_entity_int;
DELETE FROM catalog_product_entity_media_gallery;
DELETE FROM catalog_product_entity_media_gallery_value;
DELETE FROM catalog_product_entity_text;
DELETE FROM catalog_product_entity_varchar;
DELETE FROM catalog_product_website;
DELETE FROM catalog_product_link;
DELETE FROM catalog_product_super_link;
DELETE FROM catalog_product_super_attribute;
DELETE FROM catalog_product_relation;
DELETE FROM catalog_product_option;
DELETE FROM cataloginventory_stock_item;
DELETE FROM catalog_product_bundle_option;
DELETE FROM catalog_product_bundle_selection;

-- Clean up category-related tables (except root categories)
DELETE FROM catalog_category_entity WHERE entity_id > 2;
DELETE FROM catalog_category_entity_datetime WHERE entity_id > 2;
DELETE FROM catalog_category_entity_decimal WHERE entity_id > 2;
DELETE FROM catalog_category_entity_int WHERE entity_id > 2;
DELETE FROM catalog_category_entity_text WHERE entity_id > 2;
DELETE FROM catalog_category_entity_varchar WHERE entity_id > 2;
DELETE FROM catalog_category_product;

-- Clean up URL rewrites for products and categories
DELETE FROM url_rewrite WHERE entity_type = 'product';
DELETE FROM url_rewrite WHERE entity_type = 'category' AND entity_id > 2;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;