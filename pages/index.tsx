import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Discover Pleasure with Lovense</h1>
          <p className={styles.heroSubtitle}>
            Indulge in our exclusive range of premium, body-safe toys crafted for solo adventures or intimate connections.
          </p>
          <Link href="/products" className={styles.heroButton}>
            Shop Now
          </Link>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/lvp.png"
            alt="Lovense Product"
            width={500}
            height={410}
            className={styles.heroProductImage}
            priority
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Bestsellers</h2>
        <p className={styles.sectionSubtitle}>
          Explore top-rated toys loved by our community for their design and performance.
        </p>
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <Image
                src={product.image}
                alt={product.title}
                width={240}
                height={160}
                className={styles.cardImage}
              />
              <h3 className={styles.cardTitle}>{product.title}</h3>
              <p className={styles.cardText}>{product.description}</p>
              <Link href={`/products/${product.id}`} className={styles.cardButton}>
                Discover More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whyChooseUs}>
        <h2 className={styles.sectionTitle}>Why Lovense?</h2>
        <div className={styles.featuresGrid}>
          {[
            {
              icon: '/icons/discreet.png',
              title: 'Discreet Shipping',
              description: 'Your privacy is our priority with plain packaging and confidential delivery.',
            },
            {
              icon: '/icons/quality.png',
              title: 'Premium Quality',
              description: 'Crafted with body-safe materials for safe and luxurious experiences.',
            },
            {
              icon: '/icons/support.png',
              title: '24/7 Support',
              description: 'Our team is here to assist you anytime, anywhere.',
            },
            {
              icon: '/icons/tech.png',
              title: 'Smart Technology',
              description: 'App-controlled toys for seamless solo or long-distance play.',
            },
          ].map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <Image
                src={feature.icon}
                alt={feature.title}
                width={60}
                height={60}
                className={styles.featureIcon}
              />
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>What Our Customers Love</h2>
        <div className={styles.swiperContainer}>
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 5000 }}
            loop
            spaceBetween={30}
            className={styles.swiper}
          >
            {[
              {
                quote:
                  'Absolutely transformative! The quality and discreet packaging exceeded my expectations.',
                author: 'Ashley, California',
                rating: 5,
              },
              {
                quote:
                  'Our long-distance relationship feels closer than ever thanks to Lovense!',
                author: 'Jake & Emma, UK',
                rating: 5,
              },
              {
                quote:
                  'The app control is a game-changer. Fun, easy, and so well-designed.',
                author: 'Sarah, New York',
                rating: 4,
              },
            ].map((t, index) => (
              <SwiperSlide key={index}>
                <blockquote className={styles.testimonialCard}>
                  <div className={styles.rating}>
                    {Array.from({ length: t.rating }, (_, i) => (
                      <span key={i} className={styles.star}>★</span>
                    ))}
                  </div>
                  <p className={styles.testimonialQuote}>“{t.quote}”</p>
                  <footer className={styles.testimonialAuthor}>- {t.author}</footer>
                </blockquote>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <Link href="/testimonials" className={styles.testimonialButton}>
          See All Reviews
        </Link>
      </section>

      {/* Blog/Guide Teaser */}
      <section className={styles.blogSection}>
        <h2 className={styles.sectionTitle}>Explore Pleasure</h2>
        <p className={styles.sectionSubtitle}>
          Dive into our guides and stories for tips, tricks, and inspiration.
        </p>
        <div className={styles.blogGrid}>
          {[
            {
              image: '/images/blog1.jpg',
              title: 'Beginner’s Guide to Lovense Toys',
              excerpt: 'New to pleasure toys? Start your journey with confidence.',
            },
            {
              image: '/images/blog2.jpg',
              title: 'Spicing Up Long-Distance Love',
              excerpt: 'Keep the spark alive no matter the distance.',
            },
            {
              image: '/images/blog3.jpg',
              title: 'Self-Care & Pleasure',
              excerpt: 'Why prioritizing yourself feels so good.',
            },
          ].map((post, index) => (
            <div key={index} className={styles.blogCard}>
              <Image
                src={post.image}
                alt={post.title}
                width={300}
                height={200}
                className={styles.blogImage}
              />
              <h3 className={styles.blogTitle}>{post.title}</h3>
              <p className={styles.blogExcerpt}>{post.excerpt}</p>
              <Link href="/blog" className={styles.blogButton}>
                Read More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to Elevate Your Pleasure?</h2>
        <p className={styles.ctaText}>
          Discover toys that blend elegance, innovation, and intimacy.
        </p>
        <Link href="/products" className={styles.ctaButton}>
          Explore the Collection
        </Link>
      </section>
    </Layout>
  );
}