"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import turkiyeIlIlce from '../../data/turkiye-il-ilce';
import { CallMeForm } from '@/components/ui/call-me-form';

export default function FirmalarIcin() {
    const [formData, setFormData] = useState({
        ad: '',
        telefon: '',
        firma: '',
        email: '',
        sehir: '',
        ilce: '',
        mesaj: '',
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const formRef = useRef(null);

    // SSS için akordiyon indeksi
    const [activeAccordion, setActiveAccordion] = useState(null);
    const faqRefs = useRef([]);

    const [ilceler, setIlceler] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);

    // İl değiştiğinde ilçeleri güncelle
    useEffect(() => {
        if (formData.sehir) {
            const selectedProvince = turkiyeIlIlce.provinces.find(
                p => p.name === formData.sehir
            );

            if (selectedProvince) {
                // Bu ile ait tüm ilçeleri filtrele
                const districts = turkiyeIlIlce.districts.filter(
                    d => d.province_id === selectedProvince.id
                ).sort((a, b) => a.name.localeCompare(b.name, 'tr'));

                setIlceler(districts);

                // İl değiştiğinde ilçe seçimini sıfırla
                setFormData(prev => ({ ...prev, ilce: '' }));
            }
        } else {
            setIlceler([]);
        }
    }, [formData.sehir]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        // Form gönderme işlemleri burada yapılacak
        setFormSubmitted(true);

        // Form gönderildikten sonra belirli bir süre sonra mesajı kaldır ve formu sıfırla
        setTimeout(() => {
            setFormSubmitted(false);
            setFormData({
                isim: '',
                telefon: '',
                firma: '',
                sehir: '',
                ilce: '',
                email: '',
                mesaj: ''
            });
            setIsFormOpen(false); // Formu kapat
        }, 3000);
    };

    const toggleForm = () => {
        setIsFormOpen(prev => !prev);

        // Form açıldığında, bir sonraki render'da scroll et
        if (!isFormOpen) {
            setTimeout(() => {
                scrollToForm();
            }, 300);
        }
    };

    const scrollToForm = () => {
        if (formRef.current) {
            const yOffset = -100; // Üst kenardan ne kadar uzaklıkta duracağını ayarla
            const y = formRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    };

    // Akordiyon toggle işlevi
    const toggleAccordion = (index) => {
        // Eğer zaten açıksa kapat, değilse yeni indeksi aç
        const newIndex = activeAccordion === index ? null : index;
        setActiveAccordion(newIndex);

        // Eğer yeni bir akordiyon açıldıysa, ona scroll yap
        if (newIndex !== null) {
            setTimeout(() => {
                scrollToFaq(newIndex);
            }, 100);
        }
    };

    const scrollToFaq = (index) => {
        if (faqRefs.current[index]) {
            const yOffset = -120; // Üst kenardan ne kadar uzaklıkta duracağını ayarla
            const y = faqRefs.current[index].getBoundingClientRect().top + window.pageYOffset + yOffset;

            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    };

    // URL'de #iletisim-formu varsa, sayfayı yükledikten sonra otomatik olarak aç
    useEffect(() => {
        if (window.location.hash === '#iletisim-formu') {
            setIsFormOpen(true);
            setTimeout(scrollToForm, 500);
        }
    }, []);

    // SSS içeriği
    const faqItems = [
        {
            question: "Üyelik ücretli mi?",
            answer: "Davet Evi Bul'da temel üyelik tamamen ücretsizdir. Dilerseniz ekstra görünürlük için premium paketlerimizden faydalanabilirsiniz."
        },
        {
            question: "Profilimi nasıl oluşturacağım?",
            answer: "Kaydınız tamamlandıktan sonra, danışmanlarımız sizinle iletişime geçerek tüm süreçte yanınızda olacak ve profil oluşturmada yardımcı olacaklar."
        },
        {
            question: "Müşterilerle nasıl iletişim kuracağım?",
            answer: "Platformumuz üzerinden çiftler sizinle doğrudan iletişime geçebilir. Ayrıca, çiftlerin talepleri doğrultusunda telefon ve e-posta bilgileriniz de paylaşılabilir."
        },
        {
            question: "Hangi tür işletmeler üye olabilir?",
            answer: "Düğün ve organizasyon sektöründe hizmet veren tüm işletmeler (mekanlar, fotoğrafçılar, organizatörler, gelinlik mağazaları vb.) platformumuza üye olabilir."
        }
    ];

    const handleCallMeSuccess = (formData) => {
        console.log('Form bilgileri:', formData);
        // Burada form bilgileriyle ilgili işlemler yapılabilir
    };

    return (
        <main className="bg-white">
            {/* Hero Bölümü */}
            <section className="bg-gradient-to-r from-[#f8f9fa] to-[#f1f3f5] py-12 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-1/2 mb-8 md:mb-0">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4 md:mb-6 text-center md:text-left">
                                İşletmenizi <span className="text-primary">Türkiye'nin En Büyük</span> Davet Platformunda Büyütün
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-darkgray mb-6 md:mb-8 text-center md:text-left">
                                Yüzlerce çiftin hayallerindeki söz,nişan için aradığı salon ve hizmetleri sağlayan işletmeler arasında yerinizi alın.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
                                <Button href="/firmalar-icin/kayit" size="lg" className="text-sm md:text-base w-full sm:w-auto">
                                    Hemen Ücretsiz Üye Olun
                                </Button>
                                <Button href="#avantajlar" variant="outline" size="lg" className="text-sm md:text-base w-full sm:w-auto mt-3 sm:mt-0">
                                    Avantajlarımızı Görün
                                </Button>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 mt-6 md:mt-0">
                            <div className="relative rounded-lg overflow-hidden shadow-xl mx-auto max-w-sm md:max-w-full">
                                <Image
                                    src="/images/mekan-1.webp"
                                    alt="İşletmenizi Büyütün"
                                    width={600}
                                    height={400}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Avantajlar Bölümü */}
            <section id="avantajlar" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Neden <span className="text-primary">Davet Evi Bul</span> Platformunda Olmalısınız?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-secondary rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Binlerce Çifte Ulaşın</h3>
                            <p className="text-darkgray">Platformumuzda her ay yüzlerce çift düğün mekanı ve tedarikçisi arıyor. Potansiyel müşterilerinize doğrudan ulaşın.</p>
                        </div>

                        <div className="bg-secondary rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Rakiplerinizin Önüne Geçin</h3>
                            <p className="text-darkgray">Sektörünüzdeki diğer firmalar zaten burada. Rekabette geri kalmayın, müşterilerinizi rakiplerinize kaptırmayın.</p>
                        </div>

                        <div className="bg-secondary rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Doluluk Oranınızı Artırın</h3>
                            <p className="text-darkgray">Boş kalan tarihlerinizi doldurun, kapasitenizi maksimum verimlilikle kullanın ve gelirinizi artırın.</p>
                        </div>

                        <div className="bg-secondary rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Türkiye Genelinde Erişim</h3>
                            <p className="text-darkgray">Sadece lokal değil, Türkiye'nin her yerinden potansiyel müşterilere ulaşma imkanı yakalayın.</p>
                        </div>

                        <div className="bg-secondary rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Profesyonel Profil</h3>
                            <p className="text-darkgray">Görselleriniz, hizmetleriniz ve detaylı bilgilerinizle profesyonel bir firma profili oluşturun.</p>
                        </div>

                        <div className="bg-secondary rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-4">
                                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Yüzlerce İş Fırsatı</h3>
                            <p className="text-darkgray">Düğün hazırlığı yapan çiftlere kolayca ulaşarak yüzlerce iş fırsatını kaçırmayın.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kullanıcı Referansları */}
            <section className="py-16 bg-secondary">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Memnun Firmalar Ne Diyor?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <Image src="/images/person-1.webp" alt="Firma Sahibi" width={48} height={48} className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Mehmet Yılmaz</h4>
                                    <p className="text-darkgray text-sm">Yıldız Davet Salonu</p>
                                </div>
                            </div>
                            <p className="text-darkgray">"Davet Evi Bul platformunda yer aldıktan sonra doluluğumuz %30 arttı. Özellikle hafta içi günlerde bile rezervasyon almaya başladık."</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <Image src="/images/person-2.webp" alt="Firma Sahibi" width={48} height={48} className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Ayşe Demir</h4>
                                    <p className="text-darkgray text-sm">Elegance Wedding</p>
                                </div>
                            </div>
                            <p className="text-darkgray">"Türkiye'nin farklı şehirlerinden çiftlerle tanışma fırsatı bulduk. Artık başka şehirlerden de müşterilerimiz var."</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                                    <Image src="/images/person-3.jpg" alt="Firma Sahibi" width={48} height={48} className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Ali Kaya</h4>
                                    <p className="text-darkgray text-sm">Grand Balo Salonu</p>
                                </div>
                            </div>
                            <p className="text-darkgray">"Rakiplerimiz zaten buradaydı, biz de katıldık ve şimdi daha fazla talep alıyoruz. Profesyonel profil sayfamız müşterilerde güven oluşturuyor."</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* İstatistikler */}
            <section className="py-16 bg-primary/5">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50.000+</div>
                            <p className="text-darkgray">Aylık Ziyaretçi</p>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5.000+</div>
                            <p className="text-darkgray">Kayıtlı Çift</p>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
                            <p className="text-darkgray">Firma Üye</p>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">81</div>
                            <p className="text-darkgray">İlde Hizmet</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Yüzlerce İş Fırsatı */}
            <section className="py-12 md:py-16 bg-gradient-to-r from-[#111827] to-[#1f2937] text-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="w-full md:w-1/2 mb-8 md:mb-0">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center md:text-left">Yüzlerce İş Fırsatını Kaçırmayın!</h2>
                            <p className="text-base md:text-lg text-gray-300 mb-6 text-center md:text-left">
                                Osmaniye, Ordu, Rize, Sakarya, Samsun, Siirt, Sinop, Sivas, Tekirdağ, Tokat, Trabzon, Tunceli, Şanlıurfa, Uşak, Van, Yozgat, Zonguldak, Aksaray, Bayburt, Karaman, Kırıkkale, Batman, Şırnak, Bartın ve Türkiye'nin tüm illerinden çiftler sizinle çalışmak için bekliyor.
                            </p>
                            <div className="flex justify-center md:justify-start">
                                <Button href="#iletisim-formu" variant="outline" size="lg" className="border-primary text-primary hover:bg-white hover:text-gray-900 text-sm md:text-base">
                                    Hemen Katılın
                                </Button>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center mt-6 md:mt-0">
                            <div className="relative rounded-lg overflow-hidden shadow-lg max-w-sm md:max-w-full">
                                <Image
                                    src="/images/salon-8.webp"
                                    alt="İş Fırsatları"
                                    width={500}
                                    height={300}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* İletişim Formu */}
            <section id="iletisim-formu" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col w-full mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-text">Sizi Arayalım</h2>
                        <p className="text-darkgray text-sm mt-1">Bilgilerinizi bırakın, danışmanlarımız sizinle iletişime geçsin</p>
                    </div>
                    <Button
                        onClick={() => setModalOpen(true)}
                        variant="outline"
                        className="text-xs sm:text-sm border-primary text-primary hover:bg-primary hover:text-white px-2 sm:px-4 py-1 sm:py-2 w-28 sm:w-32 h-8 sm:h-10 flex justify-center items-center"
                    >
                        Sizi Arayalım
                    </Button>
                </div>
            </section>

            {/* SSS */}
            <section className="py-16 bg-secondary">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Sıkça Sorulan Sorular</h2>

                    <div className="max-w-3xl mx-auto space-y-5">
                        {faqItems.map((item, index) => (
                            <div
                                key={index}
                                ref={(el) => (faqRefs.current[index] = el)}
                                className="bg-white rounded-lg shadow-sm border border-border overflow-hidden transition-all hover:shadow-md"
                            >
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full px-6 py-5 text-left font-medium bg-white hover:bg-primary/5 flex justify-between items-center transition-colors focus:outline-none"
                                    aria-expanded={activeAccordion === index}
                                    aria-controls={`faq-content-${index}`}
                                >
                                    <h3 className="text-lg font-semibold text-text pr-4">{item.question}</h3>
                                    <div className={`flex-shrink-0 text-primary transition-transform duration-300 ${activeAccordion === index ? 'rotate-180' : ''}`}>
                                        <ChevronDown size={20} />
                                    </div>
                                </button>

                                <div
                                    id={`faq-content-${index}`}
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${activeAccordion === index
                                        ? 'max-h-96 opacity-100'
                                        : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-5 pt-1 text-darkgray border-t border-border/30">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sorunuz mu var? */}
            <section className="py-10 md:py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between bg-primary/5 rounded-lg p-5 md:p-8 border border-primary/20">
                        <div className="mb-5 sm:mb-0 sm:mr-6 text-center sm:text-left">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">Sorunuz mu var?</h2>
                            <p className="text-darkgray text-sm sm:text-base">Merak ettiğiniz bir konu varsa sizi arayalım.</p>
                        </div>
                        <Button
                            onClick={() => setModalOpen(true)}
                            variant="outline"
                            className="text-xs sm:text-sm border-primary text-primary hover:bg-primary hover:text-white px-2 sm:px-4 py-1 sm:py-2 w-28 sm:w-32 h-8 sm:h-10 flex justify-center items-center"
                        >
                            Sizi Arayalım
                        </Button>
                    </div>
                </div>
            </section>


            {/* Sizi Arayalım Modal Komponenti */}
            <CallMeForm
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleCallMeSuccess}
            />
        </main>
    );
} 