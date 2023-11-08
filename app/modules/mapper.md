# 기계데이터 맵핑

## 상황

- 다음 네가지 로직을 통해서 데이터가 업데이트 된다.
  - currentList
  - edgeMachineStat
  - extraPartCount
  - extraNoti
- 각 전달받은 데이터는 컬럼명(key)가 다르기 때문에 이 문서의 규칙을 따른다.

## 실시간 관련 변수

**바이너리 데이터의 경우 '(index) 내용'**

- currentList
  - active
  - active_time
  - start_ymdt
  - wait
- edgeMachineStat
  - ActiveTime
  - TActiveTime
  - WorkTime
  - IdleTime
- extraPartCount
  - (7) ?
  - (8) ?
  - (9) workTime
  - (10) wait
  - (11) activeTime
- extraNoti
  - (5) startTime
- web
  - activeTime
  - activeStartTime
  - reStartTime
  - workTime
  - waitTime

## web 변수의 의미와 연결

### Web변수의 의미

- workTime - 현재 가공중인 lot의 총 기계 가동 시간 **(작은 수)**
- waitTime - 현재 가공중인 lot의 준비교체 시간 **(작은 수)**
- activeTime - 현재 가공중인 lot의 순수 가공 시간? 현재 가공중인 lot의 평균 가공시간? **(작은 수)**
- activeStartTime - 현재 가공중인 단품의 시작시간 **(큰 수)**
- reStartTime - 현재 가공중인 단품의 중단 후 재시작 시각 **(큰 수)**

### 변수 연결 및 업데이트

- workTime

  - currentList.active
    ↓
  - edgeMachineStat.WorkTime
    ↓
  - extraPartCount[9] - workTime

- waitTIme

  - currentList.wait
    ↓
  - edgeMachineStat.IdleTime
    ↓
  - extraPartCount[10] - wait

- activeTime

  - currentList.active_time
    ↓
  - extraPartCount.[11] - activeTime

- activeStartTime

  - edgeMachineStat.ActiveTime
    ↓
  - extraNoti.[5] - startTime

- reStartTime
  - edgeMachineStat.TActiveTime

## 실시간 카운트 계산식

#### edgeMachineStat 수신 한 경우 남은시간 계산 식

- edgeMachineStat.WorkTime 1 이상 && edgeMachineStat.TActiveTime 1 이상

  - web.activeTime - edgeMachineStat.WorkTime - ( now - edgeMachineStat.TActiveTime )

- edgeMachineStat.WorkTime 1 이상 && edgeMachineStat.TActiveTime 0 이하

  - web.activeTime - edgeMachineStat.WorkTime

- edgeMachineStat.WorkTIme 0 이하 && edgeMachineStat.TActiveTime 0 이하
  - web.activeTime - ( now - edgeMachineStat.ActiveTime )

#### extraPartCount 수신 한 경우 남은시간 계산 식

- web.activeTime = extraPartCount.[11] - activeTime

#### extraNoti 수신 한 경우 남은시간 계산 식

- web.activeTime에서 그대로 작동시작
