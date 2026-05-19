import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCourses } from '../../services/api';
import CourseCard from '../../components/common/CourseCard';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Debounced helper
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [priceType, setPriceType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  // Predefined Categories matching seeders
  const categories = ['All', 'IELTS', 'TOEIC', 'Giao tiếp', 'Từ vựng', 'Ngữ pháp', 'Phát âm', 'Chuyên ngành'];
  const levels = [
    { value: 'All', label: 'Tất cả trình độ' },
    { value: 'beginner', label: 'Cơ bản (Beginner)' },
    { value: 'intermediate', label: 'Trung cấp (Intermediate)' },
    { value: 'advanced', label: 'Nâng cao (Advanced)' }
  ];
  const priceTypes = [
    { value: 'all', label: 'Tất cả mức giá' },
    { value: 'free', label: 'Miễn phí' },
    { value: 'paid', label: 'Có tính phí' }
  ];
  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'popular', label: 'Bán chạy nhất' },
    { value: 'priceAsc', label: 'Giá tăng dần' },
    { value: 'priceDesc', label: 'Giá giảm dần' },
    { value: 'rating', label: 'Đánh giá cao' }
  ];

  const fetchCoursesData = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        search,
        category,
        level,
        priceType,
        sortBy
      };

      const res = await getCourses(params);
      if (res) {
        setCourses(res.courses || []);
        setPagination(res.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách khóa học:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesData();
  }, [page, search, category, level, priceType, sortBy]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleResetFilters = () => {
    setSearchInput('');
    setSearch('');
    setCategory('All');
    setLevel('All');
    setPriceType('all');
    setSortBy('newest');
    setPage(1);
  };

  const handleRemoveCategory = () => {
    setCategory('All');
    setPage(1);
  };

  const handleRemoveLevel = () => {
    setLevel('All');
    setPage(1);
  };

  const handleRemovePrice = () => {
    setPriceType('all');
    setPage(1);
  };

  const handleRemoveSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Banner Section */}
        <div className="bg-gradient-to-tr from-[#1f3f2d] to-[#3a7551] rounded-3xl p-8 md:p-12 shadow-xl shadow-green-950/10 mb-12 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-2xl relative z-10">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/5">
              Định vị bản thân - Chinh phục ngôn ngữ
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mt-4 mb-4">
              Khám Phá Hàng Trăm Khóa Học Tiếng Anh Chất Lượng Cao
            </h1>
            <p className="text-green-100 text-sm md:text-base mb-8">
              Bắt đầu hành trình từ số 0 để làm chủ ngữ pháp, từ vựng và tự tin giao tiếp chuẩn bản xứ.
            </p>

            {/* Search Input Box */}
            <div className="relative max-w-lg bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex items-center">
              <svg className="w-5 h-5 text-gray-400 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm khóa học: IELTS, từ vựng, giao tiếp..."
                className="flex-1 px-3 py-2 text-sm text-gray-800 focus:outline-none placeholder-gray-400"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors mr-2"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Core Listing Container */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">

          {/* Left Column: Filter Sidebar */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-28">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 8.293A1 1 0 013 7.586V4z" />
                  </svg>
                  Bộ lọc tìm kiếm
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-red-600 hover:text-red-800 font-bold transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Danh mục khóa học</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat}
                        onChange={() => { setCategory(cat); setPage(1); }}
                        className="w-4 h-4 text-[#2f6345] border-gray-300 focus:ring-[#2f6345] accent-[#2f6345]"
                      />
                      <span className={`text-sm transition-colors ${category === cat ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'
                        }`}>
                        {cat === 'All' ? 'Tất cả danh mục' : cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-6 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Trình độ</h4>
                <div className="space-y-2">
                  {levels.map((lvl) => (
                    <label key={lvl.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="level"
                        checked={level === lvl.value}
                        onChange={() => { setLevel(lvl.value); setPage(1); }}
                        className="w-4 h-4 text-[#2f6345] border-gray-300 focus:ring-[#2f6345] accent-[#2f6345]"
                      />
                      <span className={`text-sm transition-colors ${level === lvl.value ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'
                        }`}>
                        {lvl.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Type Filter */}
              <div className="mb-2 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Học phí</h4>
                <div className="space-y-2">
                  {priceTypes.map((pt) => (
                    <label key={pt.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="priceType"
                        checked={priceType === pt.value}
                        onChange={() => { setPriceType(pt.value); setPage(1); }}
                        className="w-4 h-4 text-[#2f6345] border-gray-300 focus:ring-[#2f6345] accent-[#2f6345]"
                      />
                      <span className={`text-sm transition-colors ${priceType === pt.value ? 'text-gray-900 font-bold' : 'text-gray-600 group-hover:text-gray-900'
                        }`}>
                        {pt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Listing Items */}
          <main className="lg:col-span-9">

            {/* Header Control Panel */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-wrap justify-between items-center gap-4">
              <div className="text-sm font-semibold text-gray-700">
                Hiển thị <span className="text-gray-900 font-bold">{courses.length}</span> trên <span className="text-gray-900 font-bold">{pagination.totalItems}</span> kết quả
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#2f6345]/20 focus:border-[#2f6345]"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filter Badges */}
            {(category !== 'All' || level !== 'All' || priceType !== 'all' || search) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-gray-400 font-semibold mr-1">Lọc theo:</span>
                {search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#1f3f2d] bg-green-50 rounded-full border border-green-100">
                    Từ khóa: "{search}"
                    <button onClick={handleRemoveSearch} className="hover:text-red-500 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                )}
                {category !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#1f3f2d] bg-green-50 rounded-full border border-green-100">
                    Danh mục: {category}
                    <button onClick={handleRemoveCategory} className="hover:text-red-500 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                )}
                {level !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#1f3f2d] bg-green-50 rounded-full border border-green-100">
                    Trình độ: {levels.find(l => l.value === level)?.label.split(' ')[0]}
                    <button onClick={handleRemoveLevel} className="hover:text-red-500 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                )}
                {priceType !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#1f3f2d] bg-green-50 rounded-full border border-green-100">
                    Học phí: {priceTypes.find(p => p.value === priceType)?.label}
                    <button onClick={handleRemovePrice} className="hover:text-red-500 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Courses View Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(idx => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 animate-pulse">
                    <div className="bg-gray-200 rounded-xl h-44 w-full mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-6 bg-gray-200 rounded w-full mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-6" />
                    <div className="h-10 bg-gray-200 rounded w-full" />
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center max-w-xl mx-auto mt-8">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy khóa học nào phù hợp</h3>
                <p className="text-sm text-gray-500 mb-6">Hãy thử thay đổi điều kiện tìm kiếm hoặc thiết lập lại bộ lọc để tìm thấy các khóa học thú vị.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#1f3f2d] hover:bg-[#152a1e] text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Xóa toàn bộ bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {courses.map(course => (
                    <CourseCard key={course._id} course={course} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => setPage(prev => Math.max(1, prev - 1))}
                      disabled={page === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ←
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${page === p
                            ? 'bg-[#1f3f2d] text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={page === pagination.totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};

export default CourseList;
