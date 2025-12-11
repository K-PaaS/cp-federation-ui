import { Heading } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PageNotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/cpfedui/overview');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Heading size='7xl' textAlign='center' marginTop='7%' color='#47494d'>
        404
      </Heading>
      <Heading size='3xl' textAlign='center' paddingTop='2%' color='#47494d'>
        요청하신 페이지를 찾을 수 없습니다.
      </Heading>
      <Heading size='2xl' textAlign='center' marginTop='2%' color='#47494d'>
        잠시 후 Overview 화면으로 이동합니다.
      </Heading>
    </>
  );
}
