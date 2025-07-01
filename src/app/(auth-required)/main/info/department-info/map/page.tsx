import BottomSheet from '@/components/info/partner/bottomSheet';
import MapContainer from '@/components/info/partner/mapContainer';
import DefaultBody from '@/components/Layout/Body/defaultBody';
import BottomNav from '@/components/Layout/BottomNav/BottomNav';
import { schema } from '../schema';

type SearchParams = Promise<{ pname: string | undefined }>;

export default async function MapPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const query = searchParams.pname;

  const JSON = schema.find(partner => partner.name === query);
  const { name, tags, benefits, start_date, end_date, img } = JSON || {};

  console.log('MapPage query:', query);

  return (
    <>
      <div className="absolute w-full h-[100vh] bg-slate-400"></div>
      {/* <MapContainer address={query} /> */}
      <BottomSheet
        title={name}
        tags={tags}
        duration={[start_date, end_date]}
        timeDescription={'1학기 시작 전까지'}
        benefits={benefits}
        img={img?.sub || []}
      />
      <BottomNav />
    </>
  );
}

// interface BottomSheetProps {
//   title: string;
//   tags: Tag[];
//   duration: [start: Date, end: Date];
//   timeDescription: string;
//   benefits: string[];
//   img: string[];
// }
