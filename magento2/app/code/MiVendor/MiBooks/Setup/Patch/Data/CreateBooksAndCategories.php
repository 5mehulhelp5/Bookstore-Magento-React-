<?php
declare(strict_types=1);

namespace MiVendor\MiBooks\Setup\Patch\Data;

use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;
use Magento\Catalog\Api\CategoryLinkManagementInterface;
use Magento\Catalog\Api\Data\ProductInterfaceFactory;
use Magento\Catalog\Api\ProductRepositoryInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\App\State;
use Magento\Catalog\Model\Product\Attribute\Source\Status;
use Magento\Catalog\Model\Product\Type;
use Magento\Catalog\Model\Product\Visibility;
use Magento\CatalogInventory\Api\StockRegistryInterface;
use Psr\Log\LoggerInterface;

/**
 * Data Patch for creating initial book products and their category assignments
 *
 * This patch creates sample books across different categories like Fiction, Non-Fiction,
 * Children, Technical, and Poetry. Each book is created as a simple product with
 * standard attributes and inventory settings.
 */
class CreateBooksAndCategories implements DataPatchInterface
{
    // Class properties with dependency injection
    private ModuleDataSetupInterface $moduleDataSetup;
    private State $state;
    private ProductInterfaceFactory $productFactory;
    private ProductRepositoryInterface $productRepository;
    private CategoryLinkManagementInterface $categoryLinkManagement;
    private StockRegistryInterface $stockRegistry;
    private StoreManagerInterface $storeManager;
    private LoggerInterface $logger;

    /**
     * @param ModuleDataSetupInterface $moduleDataSetup Setup module instance
     * @param State $state Application state manager
     * @param ProductInterfaceFactory $productFactory Product creation factory
     * @param ProductRepositoryInterface $productRepository Product storage interface
     * @param CategoryLinkManagementInterface $categoryLinkManagement Category assignment manager
     * @param StockRegistryInterface $stockRegistry Inventory manager
     * @param StoreManagerInterface $storeManager Store configuration manager
     * @param LoggerInterface $logger System logger
     */
    public function __construct(
        ModuleDataSetupInterface $moduleDataSetup,
        State $state,
        ProductInterfaceFactory $productFactory,
        ProductRepositoryInterface $productRepository,
        CategoryLinkManagementInterface $categoryLinkManagement,
        StockRegistryInterface $stockRegistry,
        StoreManagerInterface $storeManager,
        LoggerInterface $logger
    ) {
        $this->moduleDataSetup = $moduleDataSetup;
        $this->state = $state;
        $this->productFactory = $productFactory;
        $this->productRepository = $productRepository;
        $this->categoryLinkManagement = $categoryLinkManagement;
        $this->stockRegistry = $stockRegistry;
        $this->storeManager = $storeManager;
        $this->logger = $logger;
    }

    /**
     * Apply data patch
     *
     * Creates books across different categories with standard product attributes
     * and assigns them to appropriate categories
     *
     * @return void
     */
    public function apply()
    {
        $this->logger->info('START: CreateBooksAndCategories Patch');
        
        // Initialize setup
        $this->moduleDataSetup->startSetup();

        // Set admin area context
        try {
            $this->state->setAreaCode(\Magento\Framework\App\Area::AREA_ADMINHTML);
        } catch (\Exception $e) {
            $this->logger->info('Area code already set: ' . $e->getMessage());
        }

        // Define category mapping
        $categoryIds = [
            'Non-Fiction' => 61,
            'Fiction' => 60,
            'Children' => 62,
            'Technical' => 63,
            'Poetry' => 64
        ];

        // Get default store configuration
        $defaultCategoryId = 2;
        $defaultWebsite = $this->storeManager->getDefaultStoreView()->getWebsiteId();
        $defaultStore = $this->storeManager->getDefaultStoreView()->getId();

        $this->logger->info('Default Website ID: ' . $defaultWebsite);
        $this->logger->info('Default Store ID: ' . $defaultStore);

        // Book data structure definition
        $booksData = [
            'Fiction' => [
                ['name' => 'The Lost City', 'price' => 19.99, 'sku' => 'book-fiction-001'],
                ['name' => 'Midnight Tales', 'price' => 24.99, 'sku' => 'book-fiction-002'],
                ['name' => 'The Last Symphony', 'price' => 21.99, 'sku' => 'book-fiction-003'],
                ['name' => 'Echoes of Tomorrow', 'price' => 18.99, 'sku' => 'book-fiction-004'],
                ['name' => 'The Silent Garden', 'price' => 22.99, 'sku' => 'book-fiction-005'],
                ['name' => 'Beyond the Horizon', 'price' => 23.99, 'sku' => 'book-fiction-006'],
                ['name' => 'The Forgotten Path', 'price' => 20.99, 'sku' => 'book-fiction-007'],
                ['name' => 'Whispers in the Dark', 'price' => 19.99, 'sku' => 'book-fiction-008'],
                ['name' => 'The Crystal Key', 'price' => 25.99, 'sku' => 'book-fiction-009'],
                ['name' => 'Seasons of Change', 'price' => 17.99, 'sku' => 'book-fiction-010']
            ],
            'Non-Fiction' => [
                ['name' => 'The Art of Learning', 'price' => 29.99, 'sku' => 'book-nonfiction-001'],
                ['name' => 'World History: A New Perspective', 'price' => 34.99, 'sku' => 'book-nonfiction-002'],
                ['name' => 'The Science of Everything', 'price' => 32.99, 'sku' => 'book-nonfiction-003'],
                ['name' => 'Modern Philosophy', 'price' => 28.99, 'sku' => 'book-nonfiction-004'],
                ['name' => 'The Human Mind', 'price' => 31.99, 'sku' => 'book-nonfiction-005'],
                ['name' => 'Economics Explained', 'price' => 33.99, 'sku' => 'book-nonfiction-006'],
                ['name' => 'The Art of Cooking', 'price' => 27.99, 'sku' => 'book-nonfiction-007'],
                ['name' => 'Space Exploration', 'price' => 35.99, 'sku' => 'book-nonfiction-008'],
                ['name' => 'Ancient Civilizations', 'price' => 30.99, 'sku' => 'book-nonfiction-009'],
                ['name' => 'The Power of Habits', 'price' => 26.99, 'sku' => 'book-nonfiction-010']
            ],
            'Children' => [
                ['name' => 'The Magic Rainbow', 'price' => 14.99, 'sku' => 'book-children-001'],
                ['name' => 'Adventures of Tommy', 'price' => 12.99, 'sku' => 'book-children-002'],
                ['name' => 'The Friendly Dragon', 'price' => 13.99, 'sku' => 'book-children-003'],
                ['name' => 'Space Cats', 'price' => 11.99, 'sku' => 'book-children-004'],
                ['name' => 'The Dancing Bear', 'price' => 15.99, 'sku' => 'book-children-005'],
                ['name' => 'My First ABC', 'price' => 10.99, 'sku' => 'book-children-006'],
                ['name' => 'Counting Stars', 'price' => 12.99, 'sku' => 'book-children-007'],
                ['name' => 'The Brave Little Train', 'price' => 13.99, 'sku' => 'book-children-008'],
                ['name' => 'Forest Friends', 'price' => 14.99, 'sku' => 'book-children-009'],
                ['name' => 'Ocean Adventures', 'price' => 11.99, 'sku' => 'book-children-010']
            ],
            'Technical' => [
                ['name' => 'Python Programming', 'price' => 49.99, 'sku' => 'book-technical-001'],
                ['name' => 'Web Development Basics', 'price' => 44.99, 'sku' => 'book-technical-002'],
                ['name' => 'Database Design', 'price' => 54.99, 'sku' => 'book-technical-003'],
                ['name' => 'Machine Learning', 'price' => 59.99, 'sku' => 'book-technical-004'],
                ['name' => 'Cloud Computing', 'price' => 47.99, 'sku' => 'book-technical-005'],
                ['name' => 'DevOps Handbook', 'price' => 52.99, 'sku' => 'book-technical-006'],
                ['name' => 'Cybersecurity Basics', 'price' => 51.99, 'sku' => 'book-technical-007'],
                ['name' => 'Data Structures', 'price' => 45.99, 'sku' => 'book-technical-008'],
                ['name' => 'Mobile App Development', 'price' => 48.99, 'sku' => 'book-technical-009'],
                ['name' => 'Software Architecture', 'price' => 53.99, 'sku' => 'book-technical-010']
            ],
            'Poetry' => [
                ['name' => 'Moonlight Verses', 'price' => 16.99, 'sku' => 'book-poetry-001'],
                ['name' => 'Urban Rhythms', 'price' => 15.99, 'sku' => 'book-poetry-002'],
                ['name' => 'Nature\'s Song', 'price' => 17.99, 'sku' => 'book-poetry-003'],
                ['name' => 'Love & Loss', 'price' => 14.99, 'sku' => 'book-poetry-004'],
                ['name' => 'Modern Sonnets', 'price' => 18.99, 'sku' => 'book-poetry-005'],
                ['name' => 'City Dreams', 'price' => 16.99, 'sku' => 'book-poetry-006'],
                ['name' => 'Ocean Poems', 'price' => 15.99, 'sku' => 'book-poetry-007'],
                ['name' => 'Mountain Songs', 'price' => 17.99, 'sku' => 'book-poetry-008'],
                ['name' => 'Seasonal Verses', 'price' => 14.99, 'sku' => 'book-poetry-009'],
                ['name' => 'Starlight Poetry', 'price' => 16.99, 'sku' => 'book-poetry-010']
            ]
        ];

        $productsCreated = 0;

        // Process each category and its books
        foreach ($booksData as $categoryName => $books) {
            $this->logger->info('Processing Category: ' . $categoryName);
            
            foreach ($books as $bookData) {
                try {
                    // Create new product instance
                    $product = $this->productFactory->create();

                    // Set basic product attributes
                    $product->setTypeId(Type::TYPE_SIMPLE)
                        ->setAttributeSetId(4)
                        ->setName($bookData['name'])
                        ->setSku($bookData['sku'])
                        ->setPrice($bookData['price'])
                        ->setVisibility(Visibility::VISIBILITY_BOTH)
                        ->setStatus(Status::STATUS_ENABLED)
                        ->setWebsiteIds([$defaultWebsite])
                        ->setStoreId($defaultStore)
                        ->setCustomAttribute('tax_class_id', 2)
                        ->setCustomAttribute('short_description', 'Description for ' . $bookData['name'])
                        ->setCustomAttribute('description', 'Description for ' . $bookData['name'])
                        ->setStockData([
                            'use_config_manage_stock' => 1,
                            'manage_stock' => 1,
                            'is_qty_decimal' => 0,
                            'is_in_stock' => 1,
                            'qty' => 100
                        ]);

                    // Save product and assign categories
                    $savedProduct = $this->productRepository->save($product);
                    $categoryAssignment = [$defaultCategoryId, $categoryIds[$categoryName]];
                    $this->categoryLinkManagement->assignProductToCategories(
                        $bookData['sku'],
                        $categoryAssignment
                    );

                    $this->logger->info('Product created: ' . $bookData['name']);
                    $productsCreated++;
                } catch (\Exception $e) {
                    $this->logger->critical('Product creation error: ' . $e->getMessage());
                    $this->logger->critical('Book data: ' . json_encode($bookData));
                }
            }
        }

        // Cleanup and logging
        $this->logger->info('TOTAL Products Created: ' . $productsCreated);
        $this->moduleDataSetup->endSetup();
        $this->logger->info('END: CreateBooksAndCategories Patch');
    }

    /**
     * {@inheritdoc}
     */
    public static function getDependencies()
    {
        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function getAliases()
    {
        return [];
    }
}