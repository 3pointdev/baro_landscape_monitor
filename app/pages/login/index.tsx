import { AxiosResponse } from "axios";
import { plainToInstance } from "class-transformer";
import { ApiModule } from "modules/api.module";
import authInstance from "modules/auth.module";
import { NextRouter } from "next/router";
import { KeyboardEvent, useEffect, useState } from "react";
import sha256 from "sha256";
import { ServerUrlType } from "src/config/constants";
import AuthDto from "src/dto/auth/auth.dto";
import styled from "styled-components";

interface IProps {
  router: NextRouter;
}

export default function Login(props: IProps) {
  const [account, setAccount] = useState({
    username: "",
    password: "",
  });
  const api = ApiModule.getInstance();

  const handlePressLogin = ({ key }: KeyboardEvent<HTMLInputElement>) => {
    if (key === "Enter") {
      loginAction();
    }
  };

  const loginAction = async () => {
    await api
      .post(ServerUrlType.BARO, "/login/login", {
        ...account,
        password: sha256(account.password),
      })
      .then((result: AxiosResponse<any>) => {
        if (result.data.success) {
          const auth = plainToInstance(AuthDto, {
            ...result.data,
            account: account.username,
            sender: window.localStorage.sender,
          });
          authInstance.saveStorage(auth);
          location.replace("/");
        } else {
          throw result.data;
        }
      });
  };

  useEffect(() => {}, []);

  return (
    <PageContainer>
      <Title>
        <h1>바로팩토리 모니터링</h1>
        <p>세로형 디스플레이</p>
      </Title>
      <InputWrap>
        <label htmlFor="user_id">ID</label>
        <input
          id="user_id"
          onChange={(e) => setAccount({ ...account, username: e.target.value })}
        />
      </InputWrap>
      <InputWrap>
        <label htmlFor="password">PW</label>
        <input
          id="password"
          type="password"
          onChange={(e) => setAccount({ ...account, password: e.target.value })}
          onKeyDown={handlePressLogin}
        />
      </InputWrap>
      <button onClick={loginAction}>로그인</button>
    </PageContainer>
  );
}

const PageContainer = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InputWrap = styled.div`
  width: 20vw;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  & label {
    flex-shrink: 0;
    width: 40px;
  }

  & input {
    width: 100%;
    height: 32px;
  }
`;
