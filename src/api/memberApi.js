import axios from 'axios';
import jwtAxios from './jwtAxios';
import publicApi from './publicApi';

const MEMBER_SERVICE_URL = "/members";

//회원가입시 인증번호 발송
export const SendVerificationEmail = async(email) => {
  const response = await publicApi.post(
      `${MEMBER_SERVICE_URL}/signup/email/send`, { email },  
    {
    timeout: 10000, // 5초
    }
  );
  console.log("email : ", email)
  return response.data;
};

//회원가입시 인증번호 검증 
export const VerifyCode = async(email, code) => {
  const response = await publicApi.post(
      `${MEMBER_SERVICE_URL}/signup/email/verify`, { email, code}
  );
  console.log("response:", response)
  return response.data;
  
};

//회원가입
export const registerMember = async(form) => {
  const response = await publicApi.post(
      `${MEMBER_SERVICE_URL}/signup`,
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
        zipcode: form.zipcode,
        addressMain: form.addressMain,
        addressSub: form.addressSub,
        role: form.role
      }
  );
  return response.data;
};

//회원 정보 조회 - 사용자
export const getMyInfo = async() => {
  const response = await jwtAxios.get(`${MEMBER_SERVICE_URL}/detail`);
  return response.data;
};

//회원 정보 상세 조회 - 관리자
export const getUserInfo = async({email}) => {
  const response = await jwtAxios.post(`${MEMBER_SERVICE_URL}/detail/admin`,{email});
  return response.data;
};

//회원 정보 목록 조회, 검색, 페이징, 정렬, 상태 필터링 - 관리자
export const getUserList = async({email, name, status, page, size, sort}) => {
  const response = await jwtAxios.get(
    `${MEMBER_SERVICE_URL}`,
    {
      params: { 
        email, 
        name, 
        status,
        page, 
        size,
        sort: sort ? sort : "createdAt,desc" // 기본값: 최신순 정렬
      }
    }
  );
  return response.data;
};

//사용자-회원 정보 수정 -전화번호 주소 
export const updateMyInfo = async({ phoneNumber, zipcode, addressMain, addressSub }) => {
  const response = await jwtAxios.patch(
    `${MEMBER_SERVICE_URL}/update`,     
   { phoneNumber, zipcode, addressMain, addressSub }
  );
  return response.data;
};

//비밀번호 변경 
export const changePassword = async({newPassword}) => {
  const response = await jwtAxios.patch(`${MEMBER_SERVICE_URL}/change-password`, {newPassword} );
  return response.data;
};

//비밀번호 찾기- 이메일 발송
export const requestPwdCode = async({email, firstName, lastName}) => {
  const response = await publicApi.post(`${MEMBER_SERVICE_URL}/password/request`, {email, firstName, lastName} );
  return response.data;
};

//비밀번호 찾기- 인증번호 검증
export const verifyPwdCode = async({email, code}) => {
  const response = await publicApi.post(`${MEMBER_SERVICE_URL}/password/verify`, {email, code} );
  return response.data;
};

//비밀번호 찾기- 재설정
export const resetPassword = async({email, password}) => {
  const response = await publicApi.post(`${MEMBER_SERVICE_URL}/password/reset`, {email, password} );
  return response.data;
};

//회원탈퇴 - 사용자
export const withdrawMyself = async() => {
  const response = await jwtAxios.patch(`${MEMBER_SERVICE_URL}/withdraw`);
  return response.data;
};

//회원삭제 - 관리자
export const deleteMember = async(emailList) => {
  const response = await jwtAxios.patch(`${MEMBER_SERVICE_URL}/withdraw/admin`, emailList);
  return response.data;
};