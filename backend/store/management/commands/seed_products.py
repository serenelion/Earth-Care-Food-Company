from django.core.management.base import BaseCommand
from store.models import Product


class Command(BaseCommand):
    help = 'Seed database with initial products'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding products...')
        
        products = [
            {
                'id': '1',
                'name': 'Catskills Greek Yogurt',
                'tagline': 'Thick, Creamy, & Alive',
                'description': 'Made from 100% grass-fed milk reclaimed from surplus. Strained traditionally for maximum protein and probiotic density. A tart, rich foundation for your gut health.',
                'price': 12.00,
                'unit': '32oz',
                'image': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop',
                'benefits': ['20g Protein per serving', 'Trillions of CFUs', 'Zero thickeners'],
                'is_active': True,
                'stock_quantity': 100
            },
            {
                'id': '2',
                'name': 'Regenerative Whey Powder',
                'tagline': 'Pure Bioavailable Recovery',
                'description': 'Cold-processed whey from our yogurt making process. Instead of throwing this "waste" away, we dehydrate it into a powerful, nutrient-dense powder perfect for smoothies.',
                'price': 45.00,
                'unit': '2lb Bag',
                'image': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop',
                'benefits': ['Cold-processed', 'Complete Amino Profile', 'Supports Muscle Repair'],
                'is_active': True,
                'stock_quantity': 50
            },
            {
                'id': '3',
                'name': 'Ancestral Kefir',
                'tagline': 'The Champagne of Dairy',
                'description': 'Fermented for 24 hours using heirloom grains. This effervescent probiotic drink is potent, tangy, and specifically designed to repopulate your microbiome.',
                'price': 10.00,
                'unit': '32oz',
                'image': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800&auto=format&fit=crop',
                'benefits': ['30+ Probiotic Strains', 'Lactose-free', 'Mood Boosting'],
                'is_active': True,
                'stock_quantity': 75
            },
            {
                'id': '4',
                'name': 'Ometepe Island Dried Mango',
                'tagline': 'Sun-Dried Sunshine from Nicaragua',
                'description': 'Hand-selected mangos from Ometepe Island, dehydrated using traditional methods to preserve nutrients and natural sweetness. These mangos were destined to rot back into compost, but now they travel across oceans to nourish communities far away.',
                'price': 15.00,
                'unit': '8oz Bag',
                'image': 'https://images.unsplash.com/photo-1614595685421-f6cb8b40c62d?q=80&w=800&auto=format&fit=crop',
                'benefits': ['Rich in Vitamin C', 'Natural Energy Boost', 'Supports Immune System'],
                'is_active': True,
                'stock_quantity': 60
            }
        ]
        
        for product_data in products:
            product, created = Product.objects.update_or_create(
                id=product_data['id'],
                defaults=product_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created product: {product.name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Updated product: {product.name}'))
        
        self.stdout.write(self.style.SUCCESS('Successfully seeded products!'))
