import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

interface Bookstore {
  SIGUN_NM: string;
  BKSTR_NM: string;
  REFINE_ROADNM_ADDR: string;
  CAFTRI_TELNO?: string;
  [key: string]: any;
}

const BookstoreSearch = () => {
  const [allData, setAllData] = useState<Bookstore[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [filteredData, setFilteredData] = useState<Bookstore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 전체 데이터 불러오기 (페이지 순회)
  const fetchAllBookstores = async () => {
    let allRows: Bookstore[] = [];
    let page = 1;

    try {
      while (true) {
        const res = await axios.get(
          'https://openapi.gg.go.kr/GgCertflyRegionBkstr',
          {
            params: {
              KEY: 'e2594afb8eff4baeae25a217a137c388',
              pIndex: page,
              pSize: 50,
              type: 'json',
            },
          }
        );

        const rows = (res.data as any)?.GgCertflyRegionBkstr?.[1]?.row ?? [];

        if (rows.length === 0) break;

        allRows.push(...rows);
        console.log('📦 수집한 전체 인증서점 데이터:', allRows);

        page += 1;
      }

      setAllData(allRows);
    } catch (err) {
      console.error('API 호출 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookstores();
  }, []);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setSelectedRegion(region);
    const filtered = allData.filter((item) => item.SIGUN_NM === region);
    setFilteredData(filtered);
  };

  // 중복 제거된 지역 목록 추출
  const regions = useMemo(() => {
    const setOfRegions = new Set(
      allData.map((item) => item.SIGUN_NM).filter(Boolean)
    );
    return Array.from(setOfRegions).sort();
  }, [allData]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">
        📚 천권으로 독서포인트 사용 가능 서점
      </h1>

      {isLoading ? (
        <p className="text-gray-500">데이터 불러오는 중...</p>
      ) : (
        <>
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className="p-2 border rounded mb-4"
          >
            <option value="">지역 선택</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>

          {selectedRegion && (
            <>
              <h2 className="text-xl font-semibold text-blue-600 mb-2">
                {selectedRegion} 인증 서점 {filteredData.length}곳
              </h2>

              {filteredData.length === 0 ? (
                <p>해당 지역에 인증 서점이 없습니다.</p>
              ) : (
                <ul className="text-left max-w-md mx-auto">
                  {filteredData.map((store, idx) => (
                    <li key={idx} className="mb-3 border-b pb-2">
                      <p className="font-bold">{store.BKSTR_NM}</p>
                      <p className="text-sm">{store.REFINE_ROADNM_ADDR}</p>
                      <p className="text-sm">{store.CAFTRI_TELNO}</p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BookstoreSearch;
