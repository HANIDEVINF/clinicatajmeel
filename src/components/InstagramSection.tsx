import React, { useState, useEffect } from 'react';
import { Instagram, Play, Heart, MessageCircle, ExternalLink, X, ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { INSTAGRAM_STORIES, INSTAGRAM_POSTS, CLINIC_CONTACT } from '../data/clinicData';
import { InstagramStoryItem, Language } from '../types';

interface InstagramSectionProps {
  currentLang: Language;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({ currentLang }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-progress through stories when modal is open
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const interval = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < INSTAGRAM_STORIES.length - 1) {
            setActiveStoryIndex((curr) => (curr !== null ? curr + 1 : null));
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2.5; // ~4 seconds per story
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, isPaused]);

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setStoryProgress(0);
    setIsPaused(false);
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setStoryProgress(0);
  };

  const nextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < INSTAGRAM_STORIES.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setStoryProgress(0);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setStoryProgress(0);
    }
  };

  const labels = {
    fr: {
      tag: 'DIRECT DEPUIS INSTAGRAM',
      title: 'Vivez le quotidien de la clinique Tadjmeel',
      subtitle: 'Retrouvez nos stories à la une, démonstrations en direct du Splendor X, protocoles HydraFacial et avis de nos patientes.',
      storiesTitle: 'Stories & Highlights Officiels',
      followBtn: 'Suivre @tadjmeel_clinica',
      followersNote: 'Plus de 15 000 patientes nous suivent sur Instagram',
      openPost: 'Voir sur Instagram',
      verifiedText: 'Compte Officiel Vérifié'
    },
    ar: {
      tag: 'مباشرة من إنستغرام',
      title: 'تابعي يوميات ونتائج عيادة تجميل',
      subtitle: 'شاهدي ستوريات العيادة اليومية، جلسات ليزر Splendor X المباشرة، هيدرافيشل وآراء المرضى الحقيقية.',
      storiesTitle: 'الستوريات والهايلايتس الرسمية',
      followBtn: 'متابعة @tadjmeel_clinica',
      followersNote: 'أكثر من 15,000 متابعة على إنستغرام',
      openPost: 'فتح في إنستغرام',
      verifiedText: 'الحساب الرسمي المعتمد'
    },
    en: {
      tag: 'DIRECT FROM INSTAGRAM',
      title: 'Real moments & clinical outcomes at Tadjmeel',
      subtitle: 'Explore our official story highlights, live Splendor X demonstrations, HydraFacial protocols, and real patient feedback.',
      storiesTitle: 'Official Stories & Highlights',
      followBtn: 'Follow @tadjmeel_clinica',
      followersNote: 'Over 15,000 followers trust Tadjmeel Clinica',
      openPost: 'View on Instagram',
      verifiedText: 'Official Verified Account'
    }
  }[currentLang];

  const currentStory: InstagramStoryItem | null =
    activeStoryIndex !== null ? INSTAGRAM_STORIES[activeStoryIndex] : null;

  return (
    <section id="results-section" className="py-20 bg-[#f5efe6] border-b border-[#ebdcc8]/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#946e27] uppercase font-bold">
              <Instagram className="w-4 h-4 text-[#c49b4b]" />
              <span>{labels.tag}</span>
            </div>
            <h2 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl lg:text-5xl text-[#1c1a17] font-semibold tracking-tight">
              {labels.title}
            </h2>
            <p className="text-[#5e5950] text-sm sm:text-base max-w-2xl leading-relaxed">
              {labels.subtitle}
            </p>
          </div>

          <a
            href={CLINIC_CONTACT.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-[#d6249f] via-[#285AEB] to-[#fd5949] text-white font-bold text-xs shadow-md hover:shadow-lg hover:opacity-95 transition-all w-fit cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>{labels.followBtn}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Stories Avatar Carousel (Highlights) */}
        <div className="mb-14 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-6 sm:gap-8 min-w-max px-2 py-2">
            {INSTAGRAM_STORIES.map((story, index) => (
              <button
                key={story.id}
                onClick={() => openStory(index)}
                className="flex flex-col items-center gap-2 group cursor-pointer text-center focus:outline-none"
              >
                {/* Gradient Instagram Ring */}
                <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] group-hover:scale-105 transition-transform duration-300 shadow-md">
                  <div className="p-[2px] rounded-full bg-[#faf8f5]">
                    <img
                      src={story.thumbnail}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover"
                    />
                  </div>
                  {/* Play badge */}
                  <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#1f1d19] border-2 border-white rounded-full flex items-center justify-center text-white">
                    <Play className="w-2.5 h-2.5 fill-white" />
                  </span>
                </div>

                <span className="text-xs font-semibold text-[#2d2a24] group-hover:text-[#946e27] transition-colors max-w-[90px] truncate">
                  {story.title}
                </span>
                <span className="text-[10px] text-[#787268] font-mono">
                  {story.highlightCategory}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Instagram Posts & Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-[#ebdcc8] flex flex-col cursor-pointer"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-square overflow-hidden bg-[#ebdcc8]">
                <img
                  src={post.imageUrl}
                  alt={post.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge top right */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full text-white text-[10px] font-mono flex items-center gap-1">
                  {post.type === 'reel' ? (
                    <>
                      <Play className="w-2.5 h-2.5 fill-white" />
                      <span>Reel</span>
                    </>
                  ) : (
                    <span>Post</span>
                  )}
                </div>

                {/* Hover overlay with likes and comments */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-5 text-white font-semibold text-sm">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>

              {/* Caption & Metadata */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs text-[#787268]">
                  <span className="font-bold text-[#1f1d19]">tadjmeel_clinica</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6] fill-[#3b82f6]/20" />
                </div>

                <p className="text-xs text-[#423e37] line-clamp-2 leading-relaxed">
                  {post.caption}
                </p>

                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-[#946e27]">
                  {post.tags.slice(0, 3).map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footnote about real Instagram content */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#787268] inline-flex items-center gap-2">
            <span>{labels.followersNote}</span>
            <span>•</span>
            <a
              href={CLINIC_CONTACT.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#946e27] hover:underline font-semibold"
            >
              Rejoindre notre communauté @tadjmeel_clinica
            </a>
          </p>
        </div>

      </div>

      {/* Interactive Instagram Story Viewer Modal */}
      {currentStory && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div 
            className="relative w-full max-w-sm sm:max-w-md bg-[#181715] rounded-3xl overflow-hidden shadow-2xl border border-white/10 text-white flex flex-col aspect-[9/16] max-h-[85vh]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Progress Bar Header */}
            <div className="absolute top-3 left-3 right-3 z-30 flex gap-1.5">
              {INSTAGRAM_STORIES.map((_, i) => (
                <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all"
                    style={{
                      width:
                        i < activeStoryIndex!
                          ? '100%'
                          : i === activeStoryIndex
                          ? `${storyProgress}%`
                          : '0%'
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Top Info Header */}
            <div className="absolute top-6 left-4 right-4 z-30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/public/tadjmeel-logo.svg"
                  alt="Tadjmeel Logo"
                  className="w-9 h-9 rounded-full border border-[#c49b4b] bg-black p-0.5 object-cover"
                />
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <span>tadjmeel_clinica</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3b82f6] fill-[#3b82f6]" />
                  </div>
                  <span className="text-[10px] text-white/70">{currentStory.date}</span>
                </div>
              </div>

              <button
                onClick={closeStory}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story Media Background */}
            <div className="relative flex-1 w-full h-full bg-[#12110f] overflow-hidden">
              <img
                src={currentStory.mediaUrl}
                alt={currentStory.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35" />
            </div>

            {/* Tap Navigation Zones */}
            <button
              onClick={prevStory}
              className="absolute left-0 top-16 bottom-24 w-1/3 z-20 cursor-pointer opacity-0"
              aria-label="Story précédente"
            />
            <button
              onClick={nextStory}
              className="absolute right-0 top-16 bottom-24 w-2/3 z-20 cursor-pointer opacity-0"
              aria-label="Story suivante"
            />

            {/* Bottom Caption & Instagram CTA */}
            <div className="absolute bottom-4 left-4 right-4 z-30 space-y-3">
              <div className="bg-black/50 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                <span className="inline-block px-2 py-0.5 rounded bg-[#c49b4b] text-[#191816] text-[10px] font-mono font-bold uppercase mb-1">
                  {currentStory.highlightCategory}
                </span>
                <p className="text-xs text-white/95 leading-relaxed font-normal">
                  {currentStory.caption}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={currentStory.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#191816] font-bold text-xs hover:bg-[#f0e7d8] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#bc1888]" />
                  <span>{labels.openPost}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white/10 backdrop-blur-md text-xs font-semibold text-white">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <span>{currentStory.likesCount}</span>
                </div>
              </div>
            </div>

            {/* Left & Right Chevron Controls for Desktop */}
            {activeStoryIndex !== null && activeStoryIndex > 0 && (
              <button
                onClick={prevStory}
                className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-40 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 items-center justify-center text-white"
                aria-label="Précédent"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {activeStoryIndex !== null && activeStoryIndex < INSTAGRAM_STORIES.length - 1 && (
              <button
                onClick={nextStory}
                className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-40 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 items-center justify-center text-white"
                aria-label="Suivant"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
