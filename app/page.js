import Link from 'next/link';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { VenueCard } from '../components/venue-card';
import { Search, MapPin, ChevronRight } from 'lucide-react';

// Örnek veri
const featuredVenues = [
  {
    id: 1,
    title: 'Mövenpick Hotel İstanbul Asia Airport',
    image: '/images/salon-1.webp',
    location: 'Pendik, İstanbul',
    price: '1.350 TL',
    discount: '%25',
    rating: 4.9,
  },
  {
    id: 2,
    title: 'Casamento',
    image: '/images/salon-2.webp',
    location: 'Sarıyer, İstanbul',
    price: '3.500 TL',
    discount: 'Hediye',
    rating: 5.0,
  },
  {
    id: 3,
    title: 'Plus Hotel',
    image: '/images/salon-4.webp',
    location: 'Şişli, İstanbul',
    price: '65.000 TL',
    discount: '%22',
    rating: 4.8,
  },
];

const weddingStories = [
  {
    id: 1,
    title: 'Bir Yıldır Hiç Yıldız Aşkımıza Engel Olamadı: Suha & Erhan',
    image: '/images/salon-8.webp',
  },
  {
    id: 2,
    title: 'Bir Alışveriş Sitesinde Uzanan Bir Aşk Hikayesi: Kağan & Ezter',
    image: '/images/salon-9.jpg',
  },
  {
    id: 3,
    title: 'Evleneceklerin İlk Görüşünde Anladılar: Gizem & Özgühan',
    image: '/images/salon-10.jpg',
  },
  {
    id: 4,
    title: 'Sıcacık Bir Tanışma Hikayesi: Yağmur & Mert',
    image: '/images/salon-11.jpg',
  },
];

const galleries = [
  {
    id: 1,
    title: 'Düğün Mekanları Özel Galerisi',
    image: '/images/salon-12.jpg',
  },
  {
    id: 2,
    title: 'En İyi Oteller Galerisi',
    image: '/images/salon-13.jpg',
  },
  {
    id: 3,
    title: 'Açık Hava Düğünleri',
    image: '/images/salon-14.jpg',
  },
  {
    id: 4,
    title: 'Kapalı Salon Düğünleri',
    image: '/images/salon-15.jpg',
  },
];

const categories = [
  {
    id: 1,
    title: 'Düğün Mekanları',
    image: '/images/salon-12.jpg',
    url: '/dugun-mekanlari',
  },
  {
    id: 2,
    title: 'Düğün Fotoğrafçıları',
    image: '/images/salon-14.jpg',
    url: '/dugun-fotografcilari',
  },
  {
    id: 3,
    title: 'Gelinlik Modelleri',
    image: '/images/salon-15.jpg',
    url: '/gelinlik-modelleri',
  },
  {
    id: 4,
    title: 'Düğün Organizasyon',
    image: '/images/salon-16.jpg',
    url: '/dugun-organizasyon',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Ayşe & Mehmet',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    location: 'İstanbul',
    comment: 'davetnerede.com sayesinde hayalimizdeki mekanı bulduk. Çok teşekkür ederiz!',
  },
  {
    id: 2,
    name: 'Zeynep & Ali',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    location: 'Ankara',
    comment: 'Mekan arama sürecimiz çok kolay geçti. Teklif alma sistemleri harika çalışıyor.',
  },
  {
    id: 3,
    name: 'Seda & Emre',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    location: 'İzmir',
    comment: 'Buradan aldığımız tekliflerle bütçemize uygun mükemmel bir mekan bulduk.',
  },
];

function FeaturedVenueCard({ title, image, location, price, discount, rating }) {
  return (
    <Link href={`/dugun-mekanlari/${title.replace(/\s+/g, '-').toLowerCase()}`} className="group">
      <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {discount && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
              {discount}
            </div>
          )}

          <div className="absolute bottom-3 right-3 bg-white text-primary text-xs font-semibold px-2 py-1 rounded-full flex items-center">
            <span className="mr-1">{rating}</span>
            ★
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-text group-hover:text-primary truncate">{title}</h3>
          <div className="flex justify-between items-center mt-2">
            <p className="text-darkgray text-sm">{location}</p>
            <p className="text-text font-semibold">{price}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6">
              Hayalinizdeki Düğün Mekanını Kolayca Bulun
            </h1>
            <p className="text-darkgray text-lg mb-8">
              Binlerce düğün mekanı ve firma arasından size özel seçenekleri keşfedin, fiyat teklifi alın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dugun-mekanlari">
                <Button size="lg" variant="primary">Mekanları Keşfedin</Button>
              </Link>
              <Link href="/dugun-firmalari">
                <Button size="lg" variant="outline">Düğün Firmaları</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16"></div>
      </section>

      {/* Featured Venues */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text">Öne Çıkan Mekanlar</h2>
            <Link href="/dugun-mekanlari" className="text-primary font-medium hover:underline">
              Tümünü Gör
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVenues.map((venue) => (
              <FeaturedVenueCard key={venue.id} {...venue} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">Nasıl Çalışır?</h2>
            <p className="text-darkgray max-w-2xl mx-auto">
              davetnerede.com ile düğün mekanı bulmak ve teklif almak çok kolay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">Mekanları Keşfedin</h3>
              <p className="text-darkgray">
                Binlerce düğün mekanı arasından filtreleme yaparak size uygun olanları bulun.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">Teklif Alın</h3>
              <p className="text-darkgray">
                Beğendiğiniz mekanlardan hızlıca fiyat teklifi alın ve karşılaştırın.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">Yerinizi Ayırtın</h3>
              <p className="text-darkgray">
                En uygun mekanı seçin ve düğün gününüz için yerinizi hemen ayırtın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">Popüler Kategoriler</h2>
            <p className="text-darkgray max-w-2xl mx-auto">
              Düğününüz için ihtiyacınız olan tüm hizmetleri bulun.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.url}
                className="group block bg-white border border-border rounded-lg overflow-hidden hover:border-primary transition-colors"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-text group-hover:text-primary">{category.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">Mutlu Çiftler</h2>
            <p className="text-darkgray max-w-2xl mx-auto">
              Platformumuz üzerinden düğün mekanlarını bulan çiftlerin yorumları.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-background p-6 rounded-lg border border-border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-text">{testimonial.name}</h4>
                    <p className="text-sm text-darkgray">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-darkgray mb-4">{testimonial.comment}</p>
                <div className="flex items-center text-primary">
                  {'★'.repeat(5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">
              Hayalinizdeki Düğünü Gerçekleştirmek İçin Hemen Başlayın
            </h2>
            <p className="text-darkgray mb-8">
              davetnerede.com ile düğün planlamanızı kolaylaştırın.
            </p>
            <Link href="/dugun-mekanlari">
              <Button size="lg" variant="primary">Mekanları Keşfedin</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
