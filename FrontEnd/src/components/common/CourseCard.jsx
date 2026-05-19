import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const discountPercent = course.discountPrice > 0 
    ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
    : 0;

  return (
    <Link to={`/courses/${course._id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full block">
      <div className="relative h-48 overflow-hidden bg-gray-900">
        <img 
          src={course.thumbnailUrl || "https://images.unsplash.com/photo-1513258496099-481620d4ce8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" 
        />
        {discountPercent > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
            -{discountPercent}%
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 text-[10px] font-black uppercase text-blue-700 bg-blue-50 rounded-md">
              {course.category || 'Ngoại ngữ'}
            </span>
            {course.level && (
              <span className="text-[10px] font-semibold text-gray-400 capitalize">
                {course.level === 'beginner' ? 'Cơ bản' : course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
              </span>
            )}
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#2f6345] transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs text-gray-500 mb-4 line-clamp-2">{course.description}</p>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
          <div>
            {course.discountPrice > 0 ? (
              <div className="flex flex-col">
                <span className="text-base font-bold text-[#2f6345]">{course.discountPrice.toLocaleString()}đ</span>
                <span className="text-[10px] text-gray-400 line-through">{course.price.toLocaleString()}đ</span>
              </div>
            ) : (
              <span className="text-base font-bold text-[#2f6345]">
                {course.price === 0 ? 'Miễn phí' : `${course.price?.toLocaleString()}đ`}
              </span>
            )}
          </div>
          <span className="text-xs font-bold text-[#2f6345] hover:text-[#1f3f2d] flex items-center transition-colors">
            Chi tiết <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
