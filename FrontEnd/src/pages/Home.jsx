import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getHomeData } from '../services/api';
import CourseCard from '../components/common/CourseCard';

// Reusable horizontal slide carousel with custom arrow navigation
const CourseSlider = ({ courses, title, icon, subtitle, bgClass = 'bg-white' }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll by 75% of container width for custom paging effect
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      scrollRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className={`py-16 ${bgClass} border-b border-gray-50 overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative group/slider">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <span className="mr-2">{icon}</span> {title}
            </h2>
            <p className="text-gray-500 text-sm md:text-base">{subtitle}</p>
          </div>
          <Link to="/courses" className="text-[#2f6345] font-semibold text-sm hover:underline hidden sm:block">Xem tất cả</Link>
        </div>

        {/* Outer relative wrapper to hold floating buttons */}
        <div className="relative px-2">
          {/* Scrollable container */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 scrollbar-none"
          >
            {courses.map(course => (
              <div 
                key={course._id} 
                className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[280px] lg:w-[calc(25%-18px)]"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>

          {/* Left Arrow Button */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 w-11 h-11 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-gray-700 hover:text-[#1f3f2d] hover:border-green-100 hover:shadow-lg focus:outline-none transition-all opacity-0 group-hover/slider:opacity-100 z-10"
            title="Trượt sang trái"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow Button */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 w-11 h-11 rounded-full bg-white border border-gray-100 shadow-md flex items-center justify-center text-gray-700 hover:text-[#1f3f2d] hover:border-green-100 hover:shadow-lg focus:outline-none transition-all opacity-0 group-hover/slider:opacity-100 z-10"
            title="Trượt sang phải"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

const Home = () => {
  const [homeData, setHomeData] = useState({ 
    promotionalCourses: [], 
    newestCourses: [], 
    bestSellingCourses: [],
    mostViewedCourses: [] 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const data = await getHomeData();
        setHomeData({
          promotionalCourses: data.promotionalCourses || [],
          newestCourses: data.newestCourses || [],
          bestSellingCourses: data.bestSellingCourses || [],
          mostViewedCourses: data.mostViewedCourses || []
        });
      } catch (err) {
        console.error("Lỗi lấy dữ liệu trang chủ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#f0fdf4] to-white -z-10"></div>
        {/* Background glow effects */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-green-200/40 rounded-full blur-3xl -z-10 transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-100/60 rounded-full blur-3xl -z-10 transform -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-green-100 shadow-sm mb-6">
                <span className="text-xl mr-2">✨</span>
                <span className="text-sm font-semibold text-green-700">Nền tảng học thông minh</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-gray-900 leading-[1.1]">
                Học Tiếng Anh <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-[#1f3f2d]">Thông Minh Hơn</span>
              </h1>
              <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Hơn 500+ khóa học, 10.000+ học viên tin dùng chuẩn quốc tế mọi trình độ ngôn ngữ.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1f3f2d] text-white text-base font-semibold hover:bg-[#152a1e] transition-all shadow-xl shadow-green-900/20 hover:-translate-y-1">
                  Học miễn phí ngay →
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-gray-700 text-base font-semibold hover:bg-gray-50 border border-gray-200 transition-all shadow-sm flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-700 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                  </div>
                  Xem video giới thiệu
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-8 sm:gap-12 pt-8 border-t border-gray-100">
                <div>
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span className="text-xl font-bold text-gray-900">4.8</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Đánh giá</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">50K+</p>
                  <p className="text-sm text-gray-500 font-medium">Học viên</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">500+</p>
                  <p className="text-sm text-gray-500 font-medium">Khóa học</p>
                </div>
              </div>
            </div>

            {/* Right Content (Floating Cards UI) */}
            <div className="lg:col-span-6 relative h-[400px] sm:h-[500px]">
               <div className="absolute inset-0 bg-gradient-to-tr from-green-100 to-white rounded-3xl transform rotate-3 scale-105 -z-10"></div>
               <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 flex flex-col gap-6 relative overflow-hidden">
                 {/* Card 1 */}
                 <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 w-4/5 self-end transform hover:-translate-y-2 transition-transform duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-900 text-sm">Tiến độ Vocabulary</h4>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">89%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full w-[89%]"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      Bạn sắp hoàn thành mục tiêu tuần này!
                    </p>
                 </div>

                 {/* Card 2 */}
                 <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 p-6 w-[90%] transform -translate-x-4 hover:-translate-y-2 transition-transform duration-300 relative">
                    <div className="absolute top-4 right-4 text-4xl font-serif text-gray-100 font-bold opacity-50">Aa</div>
                    <span className="text-xs font-bold text-orange-500 tracking-wider uppercase mb-1 block">Từ vựng nổi bật</span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">Resilience</h3>
                    <p className="text-sm text-gray-500 italic mb-4">/rɪˈzɪliəns/</p>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">Khả năng phục hồi nhanh chóng sau những khó khăn.</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Courses Sections */}
      {!loading && (
        <div className="bg-white">
          {/* Khuyến mãi */}
          {homeData.promotionalCourses?.length > 0 && (
            <section className="py-16 bg-white border-b border-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
                      <span className="text-red-500 mr-2">🔥</span> Đang Khuyến Mãi
                    </h2>
                    <p className="text-gray-500">Cơ hội sở hữu khóa học chất lượng với giá tốt nhất.</p>
                  </div>
                  <Link to="/courses" className="text-[#2f6345] font-semibold text-sm hover:underline hidden sm:block">Xem tất cả</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {homeData.promotionalCourses.map(course => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Mới nhất */}
          {homeData.newestCourses?.length > 0 && (
            <section className="py-16 bg-gray-50 border-b border-gray-100">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
                      <span className="text-blue-500 mr-2">✨</span> Khóa Học Mới Nhất
                    </h2>
                    <p className="text-gray-500">Cập nhật ngay những kiến thức tiên tiến nhất.</p>
                  </div>
                  <Link to="/courses" className="text-[#2f6345] font-semibold text-sm hover:underline hidden sm:block">Xem tất cả</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {homeData.newestCourses.map(course => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Bán chạy nhất - Paged Slider */}
          {homeData.bestSellingCourses?.length > 0 && (
            <CourseSlider 
              courses={homeData.bestSellingCourses} 
              title="Bán Chạy Nhất" 
              icon="⭐" 
              subtitle="Những khóa học được hàng ngàn học viên tin tưởng lựa chọn hàng đầu."
              bgClass="bg-white"
            />
          )}

          {/* Xem nhiều nhất - Paged Slider */}
          {homeData.mostViewedCourses?.length > 0 && (
            <CourseSlider 
              courses={homeData.mostViewedCourses} 
              title="Xem Nhiều Nhất" 
              icon="👁️" 
              subtitle="Xu hướng tìm kiếm hot nhất và các khóa học được xem nhiều nhất tuần qua."
              bgClass="bg-gray-50/50"
            />
          )}
        </div>
      )}

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Tại sao chọn EduLingo?</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Big feature card */}
            <div className="lg:col-span-5 bg-[#25c481] rounded-3xl p-10 text-white flex flex-col justify-between overflow-hidden relative shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
               <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
               <div className="mb-8">
                 <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                 </div>
                 <h3 className="text-3xl font-bold mb-4 leading-tight">Lộ trình cá nhân hóa bởi Trí tuệ nhân tạo (AI)</h3>
                 <p className="text-green-50 text-base opacity-90 leading-relaxed">
                   Hệ thống tự động phân tích điểm mạnh, điểm yếu để đề xuất bài học phù hợp nhất với trình độ và mục tiêu của bạn.
                 </p>
               </div>
            </div>

            {/* Right side grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Feature 1 */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">500+ Khóa học đa dạng</h4>
                <p className="text-sm text-gray-500">Kho tàng khóa học phong phú từ cơ bản đến chuyên ngành.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Live Sessions</h4>
                <p className="text-sm text-gray-500">Tương tác trực tiếp cùng giảng viên bản xứ.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center transform hover:-translate-y-1 transition-transform duration-300">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Ghi âm phát âm</h4>
                <p className="text-sm text-gray-500">Công nghệ nhận diện giọng nói chuẩn xác.</p>
              </div>

              {/* Feature 4 (Dark background) */}
              <div className="bg-[#1f3f2d] rounded-3xl p-8 shadow-sm flex flex-col justify-center text-white transform hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h4 className="text-lg font-bold mb-2">Chứng chỉ</h4>
                <p className="text-sm text-gray-300">Nhận chứng chỉ hoàn thành khóa học uy tín.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-50 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Học viên nói gì về chúng mình?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-50">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Hoàng Nam</h4>
                  <div className="flex text-yellow-400 mt-1">
                    {'★★★★★'.split('').map((star, i) => <span key={i} className="text-sm">{star}</span>)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Nội dung chuẩn hóa, UI/UX rất đẹp. Mình đã học ở nhiều trang nhưng đây thực sự là trang web học từ vựng hiệu quả nhất."
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-50">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Minh Khôi</h4>
                  <div className="flex text-yellow-400 mt-1">
                    {'★★★★★'.split('').map((star, i) => <span key={i} className="text-sm">{star}</span>)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Các bài học phát âm rất thực tế, AI phân tích chính xác từng lỗi nhỏ giúp mình tự tin giao tiếp với người nước ngoài hơn hẳn."
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-50">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Quỳnh Trang</h4>
                  <div className="flex text-yellow-400 mt-1">
                    {'★★★★★'.split('').map((star, i) => <span key={i} className="text-sm">{star}</span>)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                "Từ vựng chia theo nhiều cấp độ, tính tương tác cực cao. Đây quả là môi trường học tiếng Anh hoàn hảo ngay tại nhà."
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
