"use client"
import React, { useState, useEffect } from 'react'
const TripleSliders = () => {
    // Sample data for different categories
    const categoriesData = {
        gems: [
            {
                id: 1,
                title: "Ruby Gemstone",
                image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
                description: "Premium quality ruby"
            },
            {
                id: 2,
                title: "Emerald Stone",
                image: "https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=400&h=300&fit=crop",
                description: "Natural emerald gemstone"
            },
            {
                id: 3,
                title: "Sapphire Blue",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
                description: "Blue sapphire stone"
            },
            {
                id: 4,
                title: "Diamond Crystal",
                image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
                description: "Brilliant diamond"
            }
        ],
        bastuSaman: [
            {
                id: 1,
                title: "Brass Kalash",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
                description: "Traditional brass kalash"
            },
            {
                id: 2,
                title: "Incense Sticks",
                image: "https://images.unsplash.com/photo-1544376664-80b17f09d399?w=400&h=300&fit=crop",
                description: "Aromatic incense sticks"
            },
            {
                id: 3,
                title: "Oil Lamp",
                image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
                description: "Traditional oil lamp"
            },
            {
                id: 4,
                title: "Prayer Beads",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
                description: "Sacred prayer beads"
            }
        ],
        services: [
            {
                id: 1,
                title: "Horoscope Reading",
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
                description: "Detailed horoscope analysis"
            },
            {
                id: 2,
                title: "Palmistry",
                image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
                description: "Professional palm reading"
            },
            {
                id: 3,
                title: "Tarot Cards",
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
                description: "Tarot card consultation"
            },
            {
                id: 4,
                title: "Vedic Consultation",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
                description: "Ancient vedic wisdom"
            }
        ]
    }

    // State for current slide index for each category
    const [currentSlides, setCurrentSlides] = useState({
        gems: 0,
        bastuSaman: 0,
        services: 0
    })

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlides(prev => ({
                gems: (prev.gems + 1) % categoriesData.gems.length,
                bastuSaman: (prev.bastuSaman + 1) % categoriesData.bastuSaman.length,
                services: (prev.services + 1) % categoriesData.services.length
            }))
        }, 3000) // Change slide every 3 seconds

        return () => clearInterval(interval)
    }, [])

    // Navigation functions
    const nextSlide = (category) => {
        setCurrentSlides(prev => ({
            ...prev,
            [category]: (prev[category] + 1) % categoriesData[category].length
        }))
    }
    const prevSlide = (category) => {
        setCurrentSlides(prev => ({
            ...prev,
            [category]: prev[category] === 0 ? categoriesData[category].length - 1 : prev[category] - 1
        }))
    }

    const goToSlide = (category, index) => {
        setCurrentSlides(prev => ({
            ...prev,
            [category]: index
        }))
    }
    // Slider component
    const Slider = ({ category, title, data, currentIndex }) => (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64 overflow-hidden">
                {/* Main Image */}
                <div className="relative w-full h-full">
                    <img
                        src={data[currentIndex].image}
                        alt={data[currentIndex].title}
                        className="w-full h-full object-cover transition-all duration-500"/>
                </div>
            </div>
            {/* Content */}
            <div className="p-4">
                {/* Dots Navigation */}
                <div className="flex justify-center space-x-2">
                    {data.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(category, index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentIndex 
                                    ? 'bg-brand' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className='text-brand font-bold text-2xl py-6'>Special Occcations</h1>
    
            {/* Three Sliders in a Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Slider
                    category="gems"
                    title="Precious Gems"
                    data={categoriesData.gems}
                    currentIndex={currentSlides.gems}
                />
                
                <Slider
                    category="bastuSaman"
                    title="Bastu Samagri"
                    data={categoriesData.bastuSaman}
                    currentIndex={currentSlides.bastuSaman}
                />
                <Slider
                    category="services"
                    title="Jyotish Services"
                    data={categoriesData.services}
                    currentIndex={currentSlides.services}
                />
            </div>
        </div>
    )
}

export default TripleSliders