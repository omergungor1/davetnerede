"use client"
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardTitle } from '../components/ui/card';
import { VenueCard } from '../components/venue-card';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { Modal } from '../components/ui/modal';
import { RequestQuoteForm } from '../components/request-quote-form';
import Image from 'next/image';
import { ImageGallery } from '../components/ui/image-gallery';
import turkiyeIlIlce from '../data/turkiye-il-ilce';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from './context/location-context';
import { QuoteModal } from '@/components/quote/quote-modal';

// Örnek veri
const featuredVenues = [
  {
    id: 1,
    title: 'Mövenpick Hotel İstanbul Asia Airport',
    images: [
      '/images/salon-12.webp',
      '/images/salon-8.webp',
      '/images/salon-13.jpg',
      '/images/salon-4.webp'
    ],
    location: 'Pendik, İstanbul',
    price: '1.350 TL',
    discount: '%25',
    rating: 4.9,
  },
  {
    id: 2,
    title: 'Casamento',
    images: [
      '/images/salon-9.jpg',
      '/images/salon-12.webp',
      '/images/salon-13.jpg',
      '/images/salon-4.webp'
    ],
    location: 'Sarıyer, İstanbul',
    price: '3.500 TL',
    discount: 'Hediye',
    rating: 5.0,
  },
  {
    id: 3,
    title: 'Plus Hotel',
    images: [
      '/images/salon-16.jpeg',
      '/images/salon-13.jpg',
      '/images/salon-4.webp'
    ],
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
    title: 'Davet Salonları Özel Galerisi',
    image: '/images/salon-12.jpg',
  },
  {
    id: 2,
    title: 'En İyi Davet Salonları Galerisi',
    image: '/images/salon-13.jpg',
  },
  {
    id: 3,
    title: 'Açık Hava Davet Salonları Galerisi',
    image: '/images/salon-14.jpg',
  },
  {
    id: 4,
    title: 'Kapalı Davet Salonları Galerisi',
    image: '/images/salon-15.jpg',
  },
];


const categories = [
  {
    id: 1,
    title: 'Söz & Nişan Mekanları',
    image: '/images/kategori1.avif',
    url: '/salonlar',
  },
  {
    id: 2,
    title: 'Kız İsteme & Aile Tanışma',
    image: '/images/kategori2.webp',
    url: '/dugun-fotografcilari',
  },
  {
    id: 3,
    title: 'Doğum Günü & Parti Alanları',
    image: '/images/kategori3.jpg',
    url: '/davet-salon-modelleri',
  },
  {
    id: 4,
    title: 'Özel Davet & Kutlama Mekanları',
    image: '/images/kategori4.JPG',
    url: '/davet-salon-organizasyonlari',
  },
];

const testimonials = [
  {
    id: 1,
    name: 'Ayşe & Mehmet',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    location: 'İstanbul',
    comment: 'davetevibul.com sayesinde hayalimizdeki mekanı bulduk. Çok teşekkür ederiz!',
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

function FeaturedVenueCard({ title, images, location, price, discount, rating }) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const openQuoteModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuoteModalOpen(true);
  };

  const handleQuoteSuccess = () => {
    setQuoteSubmitted(true);
    setTimeout(() => {
      setIsQuoteModalOpen(false);
      setTimeout(() => {
        setQuoteSubmitted(false);
      }, 500);
    }, 2000);
  };

  return (
    <>
      <div className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          <ImageGallery
            images={images}
            alt={title}
            height="h-52"
            objectFit="object-cover"
            showArrows={false}
            allowFullScreen={false}
            link={`/salonlar/${title.replace(/\s+/g, '-').toLowerCase()}`}
          />

          {discount && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded z-10">
              {discount}
            </div>
          )}

          <div className="absolute bottom-3 right-3 bg-white text-primary text-xs font-semibold px-2 py-1 rounded-full flex items-center z-10">
            <span className="mr-1">{rating}</span>
            ★
          </div>

          <button
            onClick={openQuoteModal}
            className="absolute bottom-3 left-3 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-md hover:bg-primary/90 z-10"
          >
            Teklif Al
          </button>
        </div>

        <Link href={`/salonlar/${title.replace(/\s+/g, '-').toLowerCase()}`} className="block p-4 group">
          <h3 className="font-medium text-text group-hover:text-primary truncate">{title}</h3>
          <div className="flex justify-between items-center mt-2">
            <p className="text-darkgray text-sm">{location}</p>
            <p className="text-text font-semibold">{price}</p>
          </div>
        </Link>
      </div>

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        venue={{
          id: 'homepage',
          name: title,
          district_name: 'Genel Teklif'
        }}
      />
    </>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { location, setLocation } = useLocation();

  // Metin içindeki Türkçe karakterleri ve özel karakterleri URL'ye uygun formata dönüştürme
  const createSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/ı/g, 'i')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Seçilen konuma göre yönlendirme yapan yardımcı fonksiyon
  const navigateToLocationPage = () => {
    if (!selectedLocation) {
      toast.error("Lütfen bir il veya ilçe seçin");
      return false;
    }

    const ilSlug = createSlug(selectedLocation.province);

    if (selectedLocation.district) {
      const ilceSlug = createSlug(selectedLocation.district);
      window.location.href = `/salonlar/${ilSlug}/${ilceSlug}`;
    } else {
      window.location.href = `/salonlar/${ilSlug}`;
    }

    return true;
  };

  // Arama sonuçlarını filtreleme
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filteredProvinces = turkiyeIlIlce.provinces
      .filter(province => province.name.toLowerCase().includes(query))
      .map(province => ({ id: province.id, name: province.name, type: 'province' }));

    const filteredDistricts = turkiyeIlIlce.districts
      .filter(district => district.name.toLowerCase().includes(query))
      .map(district => {
        const province = turkiyeIlIlce.provinces.find(p => p.id === district.province_id);
        return {
          id: district.id,
          name: district.name,
          provinceId: district.province_id,
          provinceName: province ? province.name : '',
          type: 'district'
        };
      });

    // En fazla 5 il ve 10 ilçe göster
    const results = [
      ...filteredProvinces.slice(0, 5),
      ...filteredDistricts.slice(0, 10)
    ];

    setSearchResults(results);
  }, [searchQuery]);

  // Dışarı tıklandığında sonuçları gizleme
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocationSelect = (item) => {
    if (item.type === 'province') {
      setSelectedLocation({
        province: item.name,
        district: null
      });
      setLocation({
        province: item.name,
        district: null
      });
      setSearchQuery(item.name);
    } else { // district
      setSelectedLocation({
        province: item.provinceName,
        district: item.name
      });
      setLocation({
        province: item.provinceName,
        district: item.name
      });
      setSearchQuery(`${item.name}, ${item.provinceName}`);
    }
    setShowResults(false);
  };

  const handleListButtonClick = () => {
    navigateToLocationPage();
  };

  const handleViewAllClick = () => {
    // Hero bölümüne smooth scroll yap
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      heroElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <Toaster position="top-center" />

      {/* Hero Section */}
      <section className="relative bg-white" id="hero">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/hero-background.jpg"
            alt="Davet salonu arka planı"
            className="w-full h-full object-cover opacity-25"
          />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-6">
              Hayalinizdeki Davet Evini Kolayca Bulun
            </h1>
            <p className="text-darkgray text-lg mb-8">
              Binlerce davet evi ve hizmet firması arasından size en uygun seçenekleri keşfedin, hemen fiyat teklifi alın!
            </p>

            {/* Arama Bölümü */}
            <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg mb-4">
              <div className="flex items-center flex-col sm:flex-row gap-3">
                <div className="relative flex-1" ref={searchRef}>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-darkgray">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    placeholder="Adres veya bölge arayın (ör. Üsküdar, Sarıyer)"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />

                  {/* Arama Sonuçları Dropdown */}
                  {showResults && searchResults.length > 0 && (
                    <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((item) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                          onClick={() => handleLocationSelect(item)}
                        >
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-primary mr-2" />
                            <div>
                              <span className="font-medium">{item.name}</span>
                              {item.type === 'district' && (
                                <span className="text-sm text-darkgray ml-1">({item.provinceName})</span>
                              )}
                              <span className="text-xs text-darkgray ml-2">
                                {item.type === 'province' ? 'İl' : 'İlçe'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showResults && searchQuery.trim() !== '' && searchResults.length === 0 && (
                    <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-center text-darkgray">
                      Sonuç bulunamadı
                    </div>
                  )}
                </div>
                <Button
                  size="lg"
                  variant="primary"
                  className="whitespace-nowrap"
                  onClick={handleListButtonClick}
                >
                  Firmaları Listele
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16"></div>
      </section>

      {/* Featured Venues */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-lightgray">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text">Öne Çıkan Mekanlar</h2>
            <button
              onClick={handleViewAllClick}
              className="text-primary font-medium hover:underline flex items-center"
            >
              Tümünü Gör
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVenues.map((venue) => (
              <FeaturedVenueCard key={venue.id} {...venue} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform origin-top-right"></div>
        <div className="container mx-auto px-4 relative ">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">Nasıl Çalışır?</h2>
            <p className="text-darkgray max-w-2xl mx-auto">
              davetevibul.com ile davet salonu bulmak ve teklif almak çok kolay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-border">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">Mekanları Keşfedin</h3>
              <p className="text-darkgray">
                Binlerce davet salonu arasından filtreleme yaparak size uygun olanları bulun.
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
                En uygun mekanı seçin ve davetiniz için yerinizi hemen ayırtın.
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
              Davetiniz ne olursa olsun, size en uygun mekanı burada bulabilirsiniz.
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
              Platformumuz üzerinden davet salonlarını bulan çiftlerin yorumları.
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
      <section className="py-16 md:py-20 relative">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/salon-13.jpg"
            alt="Davet salonu"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/70"></div>
        </div>
        <div className="container mx-auto px-4 relative ">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-4 text-shadow">
              Hayalinizdeki Daveti Gerçekleştirmek İçin Hemen Başlayın
            </h2>
            <p className="text-darkgray mb-8">
              davetevibul.com ile davet salonu planlamanızı kolaylaştırın.
            </p>
            <Button
              size="lg"
              variant="primary"
              className="shadow-lg hover:shadow-xl transition-shadow"
              onClick={handleViewAllClick}
            >
              Mekanları Keşfedin
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
