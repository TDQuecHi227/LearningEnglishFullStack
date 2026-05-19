import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById, getCourses } from '../../services/api';
import CourseCard from '../../components/common/CourseCard';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  
  // Simulated stock/seats left (since digital courses don't have stock, we simulate remaining seats for class enrollment)
  const [seatsLeft, setSeatsLeft] = useState(12);

  // Simulated multi-image list for the swiper
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await getCourseById(id);
        setCourse(data);
        
        // Get images directly from the course object (no hardcoding)
        const courseImages = data.images && data.images.length > 0
          ? data.images
          : [data.thumbnailUrl || "https://images.unsplash.com/photo-1513258496099-481620d4ce8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"];
        
        setImages(courseImages);
        setActiveImageIndex(0);

        // Fetch related courses
        if (data.category) {
          const res = await getCourses({ category: data.category });
          if (res && res.courses) {
            // Filter out current course
            const filtered = res.courses.filter(c => c._id !== id).slice(0, 4);
            setRelatedCourses(filtered);
          }
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetail();
    // Simulate seats left based on ID
    setSeatsLeft(Math.floor(Math.random() * 15) + 3);
  }, [id]);

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 mt-4 font-semibold">Đang tải chi tiết khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khóa học</h2>
          <p className="text-gray-500 mb-6">Đường dẫn không hợp lệ hoặc khóa học đã bị gỡ.</p>
          <Link to="/" className="px-6 py-2.5 rounded-full bg-[#1f3f2d] text-white text-sm font-semibold">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercent = course.discountPrice > 0 
    ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex text-sm font-medium text-gray-500 mb-8 items-center gap-2">
          <Link to="/" className="hover:text-gray-900 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/courses" className="hover:text-gray-900 transition-colors">Khóa học</Link>
          <span>/</span>
          <span className="text-[#1f3f2d] font-bold bg-[#1f3f2d]/5 px-2 py-0.5 rounded-md truncate max-w-[200px]">
            {course.category || 'Ngoại ngữ'}
          </span>
          <span>/</span>
          <span className="text-gray-800 truncate max-w-[250px]">{course.title}</span>
        </nav>

        {/* Product Grid */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8 lg:p-12 mb-16">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
            
            {/* Left: Swiper Slider */}
            <div className="lg:col-span-6 mb-8 lg:mb-0">
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-[300px] sm:h-[400px] md:h-[450px] shadow-lg group">
                <img 
                  src={images[activeImageIndex]} 
                  alt={`Slide ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out transform hover:scale-105"
                />
                
                {/* Arrow Navigation */}
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}

                {/* Badge Discount */}
                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                    Tiết kiệm {discountPercent}%
                  </div>
                )}

                {/* Slides Dots Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                  {images.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeImageIndex === idx ? 'w-5 bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 transition-all ${
                        activeImageIndex === idx ? 'border-[#2f6345] shadow-md ring-2 ring-green-100' : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details Panel */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                {/* Category Badge & Level */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1.5 rounded-full bg-green-50 text-[#1f3f2d] text-xs font-bold uppercase tracking-wider border border-green-100">
                    {course.category || 'Ngoại ngữ'}
                  </span>
                  <span className="text-sm font-medium text-gray-500 capitalize">
                    Cấp độ: {course.level || 'Cơ bản'}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                  {course.title}
                </h1>

                {/* Ratings & Sold statistics */}
                <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.round(course.averageRating || 5))}
                      {'☆'.repeat(5 - Math.round(course.averageRating || 5))}
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {course.averageRating || 5}.0
                    </span>
                    <span className="text-xs text-gray-400">
                      ({course.totalRatings || 24} đánh giá)
                    </span>
                  </div>

                  {/* Quantity Sold Indicator */}
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-800">
                      Đã bán: <strong className="text-gray-900 font-bold">{course.totalEnrollments || 142}</strong> khóa học
                    </span>
                  </div>
                </div>

                {/* Stock Indicator ("Hàng tồn") */}
                <div className="py-6 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${seatsLeft <= 5 ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`} />
                      <span className="text-sm font-bold text-gray-800">
                        {seatsLeft <= 5 
                          ? `Gấp! Chỉ còn lại ${seatsLeft} chỗ trống` 
                          : `Tình trạng lớp học: Còn ${seatsLeft} chỗ`}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">Giới hạn học viên tối đa: 30</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${seatsLeft <= 5 ? 'bg-red-500' : 'bg-orange-500'}`}
                      style={{ width: `${(seatsLeft / 30) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Pricing section */}
                <div className="py-6">
                  {course.discountPrice > 0 ? (
                    <div className="flex items-baseline gap-4">
                      <span className="text-3xl font-extrabold text-[#2f6345]">
                        {course.discountPrice.toLocaleString()}đ
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {course.price.toLocaleString()}đ
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-extrabold text-[#2f6345]">
                      {course.price === 0 ? 'Miễn phí' : `${course.price?.toLocaleString()}đ`}
                    </span>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Đã bao gồm thuế GTGT & truy cập trọn đời tất cả cập nhật mới.</p>
                </div>

                {/* Quantity selector & Buying */}
                <div className="py-6 border-t border-gray-100 flex flex-wrap gap-4 items-center">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Số lượng tài khoản</span>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden w-32 bg-white">
                      <button 
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-gray-800">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(prev => Math.min(seatsLeft, prev + 1))}
                        className="w-10 h-10 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-[200px] flex flex-col gap-2 pt-6 sm:pt-0">
                    <span className="text-xs text-right text-gray-400">Đăng ký lớp học theo nhóm nhận nhiều ưu đãi</span>
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 px-6 bg-[#1f3f2d] hover:bg-[#152a1e] text-white font-bold rounded-xl shadow-lg shadow-green-950/20 active:scale-98 transition-all">
                        Đăng Ký Ngay
                      </button>
                      <button className="p-3 bg-green-50 hover:bg-green-100 text-[#1f3f2d] rounded-xl border border-green-100 active:scale-98 transition-all">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Info Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-16 p-6 md:p-8 lg:p-12">
          <div className="border-b border-gray-100 flex space-x-6 mb-8 overflow-x-auto pb-1">
            <button 
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-base font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'description' ? 'text-[#1f3f2d]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Mô tả khóa học
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#2f6345] rounded-full" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('curriculum')}
              className={`pb-4 text-base font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'curriculum' ? 'text-[#1f3f2d]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Lộ trình bài học ({course.totalLessons || 12} bài)
              {activeTab === 'curriculum' && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#2f6345] rounded-full" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('teacher')}
              className={`pb-4 text-base font-bold transition-all relative whitespace-nowrap ${
                activeTab === 'teacher' ? 'text-[#1f3f2d]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Giảng viên phụ trách
              {activeTab === 'teacher' && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-[#2f6345] rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-600 leading-relaxed space-y-4">
                <p className="text-base">{course.description || "Khóa học này sẽ trang bị cho bạn toàn bộ kiến thức nền tảng và chuyên sâu nhất. Giáo trình biên soạn chi tiết, dễ hiểu, phù hợp với mọi học viên muốn bứt phá giới hạn ngôn ngữ."}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">✓</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Học mọi lúc mọi nơi</h4>
                      <p className="text-xs text-gray-500">Truy cập khóa học trọn đời trên mọi trình duyệt web hoặc di động.</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">✓</div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Bài tập thực hành</h4>
                      <p className="text-xs text-gray-500">Hàng ngàn câu trắc nghiệm, bài tập flashcard thông minh nhớ từ vựng sâu.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-3">
                {[
                  "Giới thiệu tổng quan lộ trình học & phương pháp",
                  "Phát âm nguyên âm & phụ âm chuẩn IPA",
                  "100 Từ vựng thông dụng nhất theo chủ điểm",
                  "Cách xây dựng câu giao tiếp cơ bản không vấp",
                  "Luyện tập tương tác thực tế ảo với AI"
                ].map((lesson, idx) => (
                  <div key={idx} className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#1f3f2d]/5 text-[#1f3f2d] flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">{lesson}</span>
                    </div>
                    <span className="text-xs text-gray-400">Bài học thử</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'teacher' && (
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-green-50 to-[#1f3f2d] p-0.5 shadow-md">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl font-bold text-[#1f3f2d]">
                    {course.teacherId?.username?.substring(0, 2).toUpperCase() || "GV"}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {course.teacherId?.username || "Giảng Viên EduLingo"}
                  </h3>
                  <p className="text-xs text-green-700 font-bold mb-2">Giảng viên bản ngữ / Chuyên gia IELTS 8.5+</p>
                  <p className="text-sm text-gray-500 max-w-xl">
                    Với hơn 8 năm kinh nghiệm giảng dạy và phát triển giáo trình ngôn ngữ tương tác, thầy luôn có phương pháp dạy sinh động, trực quan giúp học viên tiến bộ vượt bậc chỉ trong thời gian ngắn.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Grid ("Sản phẩm tương tự") */}
        {relatedCourses.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Sản phẩm tương tự</h2>
                <p className="text-sm text-gray-500 mt-1">Các khóa học cùng thuộc danh mục {course.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCourses.map((rc) => (
                <CourseCard key={rc._id} course={rc} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseDetail;
