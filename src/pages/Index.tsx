
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  MapPin, 
  Shield, 
  Smartphone, 
  Star, 
  ThumbsUp, 
  Users,
  Leaf,
  Music,
  Zap,
  Calendar,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeIn');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    
    if (howItWorksRef.current) {
      observer.observe(howItWorksRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <MapPin className="h-6 w-6 text-gocabs-primary" />,
      title: "Multi-stop rides",
      description: "Plan your journey with multiple destinations in a single ride"
    },
    {
      icon: <CreditCard className="h-6 w-6 text-gocabs-primary" />,
      title: "Fare negotiation",
      description: "Negotiate the price directly with your driver for the best deal"
    },
    {
      icon: <ThumbsUp className="h-6 w-6 text-gocabs-primary" />,
      title: "Favorite drivers",
      description: "Save your preferred drivers for future bookings"
    },
    {
      icon: <Shield className="h-6 w-6 text-gocabs-primary" />,
      title: "Emergency features",
      description: "Quick access to emergency contacts and driver swap"
    },
    {
      icon: <Leaf className="h-6 w-6 text-gocabs-primary" />,
      title: "Carbon footprint",
      description: "Track and reduce your environmental impact with each ride"
    },
    {
      icon: <Clock className="h-6 w-6 text-gocabs-primary" />,
      title: "Subscription passes",
      description: "Save money with daily, weekly or monthly ride passes"
    },
    {
      icon: <Music className="h-6 w-6 text-gocabs-primary" />,
      title: "Ride preferences",
      description: "Set your music, temperature and conversation preferences"
    },
    {
      icon: <Users className="h-6 w-6 text-gocabs-primary" />,
      title: "Ride pooling",
      description: "Share your ride with others going the same direction"
    }
  ];

  const howItWorks = [
    {
      icon: <Smartphone className="h-10 w-10 text-gocabs-primary" />,
      title: "Request a ride",
      description: "Enter your destination and select the type of ride you want"
    },
    {
      icon: <Users className="h-10 w-10 text-gocabs-primary" />,
      title: "Get matched with a driver",
      description: "We'll connect you with the best driver nearby"
    },
    {
      icon: <Zap className="h-10 w-10 text-gocabs-primary" />,
      title: "Track your ride",
      description: "Follow your driver's arrival and journey in real-time"
    },
    {
      icon: <Star className="h-10 w-10 text-gocabs-primary" />,
      title: "Arrive safely",
      description: "Rate your driver and save them as a favorite for next time"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Daily Commuter",
      content: "GoCabs has transformed my morning commute. The subscription plan saves me money, and I love being able to customize my ride experience.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Business Traveler",
      content: "The multi-stop feature is perfect for my client meetings. I can plan my entire day in one booking, and the drivers are always professional.",
      rating: 5
    },
    {
      name: "Aisha Patel",
      role: "Weekend Explorer",
      content: "I love the carbon footprint tracker! It makes me feel good about my transportation choices, and the ride-pooling option has helped me meet new people.",
      rating: 4
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-['Inter',sans-serif]">
      {/* Hero Section with Animated Car */}
      <section className="relative bg-gradient-to-r from-gocabs-secondary to-gocabs-accent text-white min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-fadeIn">
                Your journey, your way with GoCabs
              </h1>
              <p className="text-xl mb-8 text-gray-200 max-w-lg animate-fadeIn stagger-item">
                Experience the most comfortable and customizable ride-hailing service. Book, ride, and enjoy!
              </p>
              <div className="flex flex-wrap gap-4 animate-fadeIn stagger-item">
                <Button asChild size="lg" className="bg-gocabs-primary hover:bg-gocabs-primary/90 text-white border-none shadow-lg transition-all duration-300 hover-lift">
                  <Link to="/booking">Book Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 shadow-lg transition-all duration-300 hover-lift">
                  <Link to="/booking">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center relative">
              {/* Animated Car on Road */}
              <div className="road-container w-full max-w-lg rounded-lg overflow-hidden">
                <div className="road"></div>
                <div className="car-animation"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gocabs-secondary/50" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 opacity-0 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-4 text-gocabs-secondary dark:text-white">Premium Features for Premium Rides</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enjoy a range of advanced features designed to make your rides more comfortable and convenient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="finora-card hover-lift hover-glow opacity-0 animate-fadeIn stagger-item"
              >
                <CardContent className="p-6">
                  <div className="mb-4 bg-gocabs-primary/10 p-3 rounded-full inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gocabs-secondary dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gocabs-secondary" ref={howItWorksRef}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 opacity-0 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-4 text-gocabs-secondary dark:text-white">How GoCabs Works</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Getting a ride is easier than ever with our simple four-step process
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center opacity-0 animate-fadeIn stagger-item hover-lift">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gocabs-primary/10 text-gocabs-primary mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gocabs-secondary dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gocabs-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gocabs-secondary dark:text-white">What Our Riders Say</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our happy customers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="finora-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-gray-300" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="bg-gocabs-primary/20 rounded-full w-12 h-12 flex items-center justify-center text-gocabs-primary font-bold mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gocabs-secondary dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-20 bg-gocabs-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Download the GoCabs App</h2>
              <p className="text-xl mb-8">
                Get the full experience with our mobile app. Book rides, track your driver, and manage your account on the go.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="outline" className="border-white bg-white/10 text-white hover:bg-white/20 shadow-lg transition-all duration-300 hover-lift">
                  <a href="#" className="flex items-center">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.6,13.3c0-0.2,0-0.3,0-0.5c0-0.2,0-0.4,0-0.6c0-0.6-0.1-1.2-0.2-1.7c-0.2-0.6-0.5-1.1-0.9-1.5c-0.4-0.4-0.9-0.7-1.4-0.9
                      c-0.6-0.2-1.3-0.2-2-0.2H7.5c-0.3,0-0.6,0-0.9,0.1c-0.3,0.1-0.5,0.2-0.7,0.3C5.7,8.5,5.5,8.7,5.3,8.9C5.1,9.1,5,9.3,4.9,9.5
                      c-0.1,0.2-0.2,0.4-0.2,0.7C4.6,10.4,4.6,10.6,4.6,10.9v2.2c0,0.3,0,0.5,0.1,0.8c0,0.2,0.1,0.5,0.2,0.7c0.1,0.2,0.2,0.4,0.4,0.6
                      c0.1,0.2,0.3,0.3,0.5,0.5c0.2,0.1,0.4,0.2,0.7,0.3c0.3,0.1,0.5,0.1,0.8,0.1h5.6c0.7,0,1.4-0.1,2-0.3c0.5-0.2,1-0.5,1.4-0.9
                      c0.4-0.4,0.7-0.9,0.9-1.5C17.5,14.5,17.6,13.9,17.6,13.3z M12.9,8C12.9,8,12.9,8,12.9,8L12.9,8L12.9,8z M5.3,16
                      C5.3,16,5.3,16,5.3,16L5.3,16L5.3,16z M21.9,15.1c-0.1-0.2-0.2-0.4-0.4-0.6c-0.2-0.2-0.3-0.3-0.5-0.5c0.3-0.3,0.6-0.6,0.8-1
                      c0.2-0.4,0.3-0.8,0.3-1.3c0-0.3-0.1-0.7-0.2-1c-0.1-0.3-0.3-0.6-0.5-0.8c-0.2-0.2-0.5-0.4-0.8-0.6c-0.3-0.1-0.7-0.2-1-0.2h-0.1
                      c-0.1-0.6-0.3-1.1-0.5-1.6c-0.3-0.5-0.6-0.9-1-1.3c-0.4-0.4-0.9-0.7-1.4-0.9c-0.5-0.2-1.1-0.3-1.6-0.3H8.3C8,5.1,7.8,5.1,7.5,5.1
                      C7.2,5.2,7,5.3,6.7,5.5C6.5,5.6,6.3,5.8,6.1,6C5.9,6.2,5.8,6.4,5.7,6.7C5.6,6.9,5.5,7.2,5.5,7.4c0,0.3-0.1,0.6-0.1,0.8v3.4
                      c0,0.3,0,0.6,0.1,0.9c0,0.3,0.1,0.5,0.2,0.8c0.1,0.2,0.2,0.5,0.4,0.7c0.2,0.2,0.3,0.4,0.6,0.5c-0.1,0.1-0.1,0.3-0.2,0.4
                      c-0.1,0.1-0.1,0.3-0.1,0.4c0,0.2,0,0.4,0.1,0.6c0.1,0.2,0.2,0.4,0.3,0.5c0.1,0.1,0.3,0.3,0.4,0.3c0.2,0.1,0.3,0.1,0.5,0.1h5.9
                      c0.5,0,1-0.1,1.5-0.3c0.5-0.2,0.9-0.5,1.3-0.8c0.4-0.3,0.7-0.7,0.9-1.2c0.2-0.5,0.4-0.9,0.4-1.4v-0.3c0.3,0,0.5-0.1,0.8-0.1
                      c0.3-0.1,0.5-0.2,0.7-0.4c0.2-0.2,0.4-0.4,0.5-0.6c0.1-0.2,0.2-0.5,0.2-0.8C22,15.6,22,15.3,21.9,15.1z"/>
                    </svg>
                    App Store
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-white bg-white/10 text-white hover:bg-white/20 shadow-lg transition-all duration-300 hover-lift">
                  <a href="#" className="flex items-center">
                    <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.9,3.2,2.4,3.6,2.1c0.4-0.3,0.9-0.4,1.4-0.2l14.4,8.5c0.4,0.2,0.6,0.5,0.6,0.9
                       c0,0.4-0.2,0.7-0.6,0.9L5,20.7c-0.2,0.1-0.4,0.1-0.6,0.1c-0.3,0-0.5-0.1-0.8-0.2C3.2,20.4,3,20,3,20.5z"/>
                    </svg>
                    Google Play
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img src="/lovable-uploads/bcde0d9b-3b24-48f1-badc-5bcbe2d0e87b.png" alt="Mobile app" className="max-w-xs w-full relative z-10 hover-lift" />
                <div className="absolute inset-0 bg-gocabs-primary/20 filter blur-xl rounded-full transform -translate-y-1/4 scale-75 z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gocabs-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to experience better rides?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of happy riders who have chosen GoCabs for their daily commute and special journeys.
          </p>
          <Button asChild size="lg" className="bg-gocabs-primary hover:bg-gocabs-primary/90 text-white shadow-lg transition-all duration-300 hover-lift">
            <Link to="/booking" className="flex items-center">
              Book Your First Ride <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
