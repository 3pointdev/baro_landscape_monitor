import { inject, observer } from "mobx-react";
import { NextRouter } from "next/router";
import ViewModel from "src/viewModel/viewModel";
import styled from "styled-components";

interface IProps {
  router: NextRouter;
  viewModel: ViewModel;
}

function Login({ viewModel }: IProps) {
  return (
    <PageContainer>
      <Title>
        <h1>바로팩토리 모니터링</h1>
        <p>3D 모니터링</p>
      </Title>
      <InputWrap>
        <label htmlFor="user_id">ID</label>
        <input
          id="user_id"
          onChange={viewModel.handleChangeUsername}
          value={viewModel.account.username}
        />
      </InputWrap>
      <InputWrap>
        <label htmlFor="password">PW</label>
        <input
          id="password"
          type="password"
          onChange={viewModel.handleChangePassword}
          onKeyDown={viewModel.handlePressLogin}
          value={viewModel.account.password}
        />
      </InputWrap>
      <button onClick={viewModel.loginAction}>로그인</button>
    </PageContainer>
  );
}

export default inject("viewModel")(observer(Login));

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
