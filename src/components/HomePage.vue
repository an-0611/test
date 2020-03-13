<template>
  <div>
    <h1>{{ pageName }}</h1>
    <!-- Container -->
    <div class="container">
      <!-- userInfo -->
      <div class="userInfoSection">
        <div class="leftSection">
          <div v-if="isLogin && !isAdmin && userInfo.chips >= 0" class="chipBox">Chip Balance: {{ userInfo.chips - betSum }}</div>
        </div>
        <div class="rightSection">
          <div class="userInfo" v-if="isLogin">
            <img v-if="userInfo.avatar" :src="userInfo.avatar" :alt="userInfo.nickname">
            <div class="usernameBox">Hi, {{ isAdmin ? 'admin' : userInfo.nickname }}</div>
            <div class="LoginOutBtn" @click="logout">Logout</div>
          </div>
          
          <div id="google-signin-button" v-show="!isLogin"></div>
        </div>
      </div>
      <!-- userInfo end -->
      
      <!-- Pagination -->
      <div class="content">
        <nav>
          <ul>
            <li
              v-for="(name, index) in _paginationList"
              :key="index"
              :class="{ selected : selectedPagination === name }"
              @click="handlePagination(name)"
            >{{ name}}
            </li>
          </ul>
        </nav>

        <div class="pagination">
          <!-- admin interface -->
          <div v-if="isAdmin" id="forAdmin">
            <div v-for="(name, index) in _paginationList" :key="index">
              <div v-if="selectedPagination === name">
                <h3 class="topic">{{ name }} ({{ adminQuestions.length }})</h3>
                <div class="adminFieldBox">
                  <div class="field">id</div>
                  <div class="field">title</div>
                  <div class="field">StartTime</div>
                  <div class="field">DueTime</div>
                  <div class="field">status</div>
                </div>

                <NoData v-if="adminQuestions.length === 0" text="questions" />
                <div v-else>
                  <div v-for="(question, index) in adminQuestions" :key="index" class="question-box">
                    <div class="adminContentBox">
                      <div class="field">{{ question.id }}</div>
                      <div class="field">{{ question.title }}</div>
                      <div class="field">
                        <p v-if="!isAbleEdit || question.id !== selectedQuestionId">{{ new Date(question.start_at).toLocaleString() }}</p>
                        <div v-else>
                          <input type="date" v-model="dateValue.startTime">
                          <vue-timepicker lazy format="HH:mm:ss" v-model="timeValue.startTime"></vue-timepicker>
                        </div>
                      </div>
                      <div class="field">
                        <p v-if="!isAbleEdit || question.id !== selectedQuestionId">{{ new Date(question.revealed_at).toLocaleString() }}</p>
                        <div v-else>
                          <input type="date" v-model="dateValue.revealedTime">
                          <vue-timepicker lazy format="HH:mm:ss" v-model="timeValue.revealedTime"></vue-timepicker>
                        </div>
                      </div>
                      <div class="field">
                        <button v-if="!isAbleEdit || question.id !== selectedQuestionId" @click="handleEdit('edit', question.id)">edit</button>
                        <div v-else>
                          <button @click="handleEdit('cancel')">cancel</button>
                          <button @click="handleEdit('confirm', question.id)">confirm</button>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- user interface -->
          <div v-else id="forUser">
            <h3 class="topic" v-if="selectedPagination !== 'Betting History'">{{ topic }}</h3>
            <!-- HomePageContent -->
            <div id="HomePageContent" v-if="selectedPagination === 'HomePage'">
              <Loading v-if="fetchQuestionLoading" />
              <div v-else>
                <NoData v-if="(!isLogin && !isVisitorsQuestions.length) || !isVisitorsQuestions.length" text="questions" />
                <div v-if="!fetchQuestionLoading && isVisitorsQuestions.length">
                  <div class="question-box" v-for="(question, index) in isVisitorsQuestions" :key="question.id">
                    <p class="question-title">Q{{ index + 1 }}. {{ question.title }}</p>
                    <span class="odd">* Odds: {{ question.options[0].odds }}</span>
                    <ul>
                        <li v-for="option in question.options" :key="option.id">
                            <input type="radio" :name="question.id" :value="option.id" @change="updateOption(question, index, $event)" :disabled="!isLogin || waitingResult || getResult" :checked="chosenOptions[index] && chosenOptions[index].option_id === option.id">
                            {{ option.title }}
                        </li>
                        <div v-if="chosenOptions[index] && isLogin">
                          <input class="bettingInput" type="number" :max='userInfo.chips - betSum' :min="0" @change="updateBet(index, $event)" v-model.number="chosenOptions[index].chips" :disabled="!isLogin || waitingResult || getResult">
                        </div>
                    </ul>

                    <!-- result section => show when event expired-->
                    <div v-if="chosenOptions[index]">
                      <div v-if="getResult && isLogin">
                        <div class="resultInfo" :class="{ green: chosenOptions[index].option_id === question.answer.id }">
                          <p>Correct Answer: {{ question.answer.title }}</p>
                          <p>Bonus chips earned: {{ chosenOptions[index] && chosenOptions[index].option_id === question.answer.id ? (chosenOptions[index].chips * question.options[0].odds) : '0' }}</p>
                        </div>
                      </div>
                    </div>
                    <!-- result section end -->
                  </div>
                </div>
              </div>

              <!-- btn section -->
              <div v-if="isLogin && isVisitorsQuestions.length && questions.length - isVisitorsQuestions.length - filterHistoryBetOptions.length >= 0">
                <button v-if="!waitingResult" class="confirmBtn margin-filling-50" @click="showPopup">{{ getResult ? 'Claim bonus chips' : 'confirm' }}</button>
                <div v-else class="margin-filling-50">Waiting for result to be revealed</div>
              </div>
            </div>
            <!-- HomePageContentEnd -->

            <div id="EventRules" v-if="selectedPagination === 'Event Rules'">
              <EventRules />
            </div>

            <div id="BettingHistory" v-if="selectedPagination === 'Betting History'">
              <BettingHistory :filterHistoryBetOptions="filterHistoryBetOptions" />
            </div>
          </div>
        </div>
      </div>
      <!-- Pagination end -->
    </div>
    <!-- Container end-->

    <!-- Popup -->
    <div class="popup" v-if="isShowPopup">
      <h4>Notice</h4>
      <p v-if="!waitingResult && !getResult">You will be spending total {{ betSum }} chips this round.</p>
      <p v-else >You have earned total {{ bonus }} bonus chips in this round.</p>
      <div class="btnBox">
        <div class="btn" @click="closePopup">Cancel</div>
        <div class="btn" @click="getResult ? handleConfirmClaimBonus() : handleConfirmBet()">Confirm</div>
      </div>
    </div>
    <!-- Popup end -->

  </div>
</template>

<script>
// lib
import { debounce } from 'lodash';
import { mapState, mapActions } from 'vuex';
import VueTimepicker from 'vue2-timepicker'
// components
import EventRules from './EventRules';
import BettingHistory from './BettingHistory';
import Loading from './Loading';
import NoData from './NoData';

export default {
  name: 'HomePage',
  components: {
    EventRules,
    BettingHistory,
    Loading,
    NoData,
    VueTimepicker
  },
  mounted() {
    this.fetchQuestions();
    window.gapi.signin2.render('google-signin-button', {
      onsuccess: this.onSignIn
    });
  },
  methods: {
    ...mapActions('homePage', [
      'adminLogin',
      'adminEdit',
      'cancelAdminEdit',
      'fetchUserInfo',
      'setUserInfo',
      'logout',
      'setPagination',
      'fetchQuestions',
      'setBetSum',
      'confirmBet',
      'setBonus',
      'confirmClaimBonus',
      'showPopup',
      'closePopup',
    ]),
    transformNewDate: function(date, time) {
      const { HH, mm, ss } = time;
      const year = date.substring(0, 4);
      const month = date.substring(5, 7);
      const day = date.substring(8, 10);
      const newDate = new Date(year, month - 1, day, HH, mm, ss);
      return newDate.toISOString();
    },
    handleEdit: function(type, questionId) {
      const index = this.questions.findIndex(question => question.id === questionId);
      if (type === 'edit') {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000; // timezone polyfill
        const startTime = (new Date(new Date(this.questions[index].start_at).getTime() - tzoffset)).toISOString().slice(0, -1);
        const revealedTime = (new Date(new Date(this.questions[index].revealed_at).getTime() - tzoffset)).toISOString().slice(0, -1);
        const initDateValue = {
          startTime: startTime.slice(0,10), // get polyfill ISOString time
          revealedTime: revealedTime.slice(0,10), // get polyfill ISOString time
        }
        const _startTime = new Date(startTime); // transform Date object to get HH, mm, ss
        const _revealedTime = new Date(revealedTime); // transform Date object to get HH, mm, ss
        const initTimeValue = {
          startTime: {
            HH: (_startTime.getHours() < 10 ? '0' : '') + _startTime.getHours().toString(),
            mm: (_startTime.getMinutes() < 10 ? '0' : '') + _startTime.getMinutes().toString(),
            ss: (_startTime.getSeconds() < 10 ? '0' : '') + _startTime.getSeconds().toString(),
          },
          revealedTime: {
            HH: (_revealedTime.getHours() < 10 ? '0' : '') + _revealedTime.getHours().toString(),
            mm: (_revealedTime.getMinutes() < 10 ? '0' : '') + _revealedTime.getMinutes().toString(),
            ss: (_revealedTime.getSeconds() < 10 ? '0' : '') + _revealedTime.getSeconds().toString(),
          }
        }
        const initData = {
          questionId,
          initDateValue,
          initTimeValue,
        }
        this.adminEdit(initData);
        return;
      }
      if (type === 'confirm') {
        this.cancelAdminEdit();
        this.$set(this.questions, index, {
          ...this.questions[index],
          start_at: this.transformNewDate(this.dateValue.startTime, this.timeValue.startTime),
          revealed_at: this.transformNewDate(this.dateValue.revealedTime, this.timeValue.revealedTime),
        });
      }
      if (type === 'cancel') this.cancelAdminEdit();
    },
    onSignIn: function(googleUser) {
      const id_token = googleUser.getAuthResponse().id_token;
      const email = googleUser.getBasicProfile().getEmail();
      if (id_token) {
        if (this.questions.length === 0) this.fetchQuestions();
        if (this.adminList.indexOf(email) > -1) { // if admin account login
          this.adminLogin()
          return;
        }
        if (!this.userInfo.chips) this.fetchUserInfo();
        else this.setUserInfo({ userInfo: this.userInfo });
      } else {
        throw new Error('thirdPartyLoginfail');
      }
    },
    handlePagination: function(name) {
      this.setPagination({ name });
    },
    updateOption: function(question, questionIndex, event) {
      const option_id = Number(event.target.value);
      if (this.chosenOptions[questionIndex]) {
        this.$set(this.chosenOptions, questionIndex, { ...this.chosenOptions[questionIndex], option_id });
      } else {
        const initOption = {
          questionId: question.id,
          option_id,
          chips: 0,
          title: question.title,
          answerId: question.answer.id,
          answerTitle: question.answer.title,
          odds: question.answer.odds,
        }
        this.$set(this.chosenOptions, questionIndex, initOption);
      }
    },
    updateBet: debounce(function(questionIndex, event) {
      const chips = Number(event.target.value);
      if (chips < 0) this.$set(this.chosenOptions, questionIndex, { ...this.chosenOptions[questionIndex], chips: 0 });
      else this.$set(this.chosenOptions, questionIndex, { ...this.chosenOptions[questionIndex], chips }); // updateChips
      let betSum = this.chosenOptions.map(option => option.chips).reduce((a, b) => a + b, 0);
      if (betSum > this.userInfo.chips) {
        this.$set(this.chosenOptions, questionIndex, { ...this.chosenOptions[questionIndex], chips: chips - (betSum - this.userInfo.chips) }); // be biggest available bet
        this.setBetSum({ betSum: this.userInfo.chips });
        return;
      }
      this.setBetSum({ betSum });
    }, 500),
    handleConfirmBet: function() {
      this.closePopup();
      this.confirmBet();
      setTimeout(() => {
        const currentAnswer = this.chosenOptions.filter(option => option && option.option_id === option.answerId);
        let bonus = currentAnswer.length > 0 ? currentAnswer.map(el => el.chips * el.odds).reduce((a, b) => a + b, 0) : 0;
        this.chosenOptions.filter(option => option && option.option_id === option.answerId).forEach(option => option.claimBonus = (option.chips * option.odds));
        this.setBonus({ bonus });
      }, 1000);
    },
    handleConfirmClaimBonus: function() {
      this.confirmClaimBonus();
      this.closePopup();
    },
  },
  computed: {
    isVisitorsQuestions() {
      const now = new Date().toISOString();
      if (this.isAdmin) { // admin
        return this.questions;
      } else if (!this.isLogin) { // visitors
        return this.questions.filter(question => now >= question.start_at && now <= question.revealed_at);
      } else { // general user
        const bettedQuestionId = this.historyBetOptions.map(question => question && question.questionId);
        return this.questions.filter(question => now >= question.start_at && now <= question.revealed_at && bettedQuestionId.indexOf(question.id) === -1);
      }
    },
    _paginationList() {
      return this.isAdmin ? this.adminPaginationList : this.paginationList;
    },
    adminQuestions() {
      const date = new Date().toISOString();
      if (this.selectedPagination === 'Not Started') return this.questions.filter(question => question.revealed_at >= date && question.start_at >= date);
      else if (this.selectedPagination === 'In progress') return this.questions.filter(question => question.revealed_at >= date && question.start_at <= date);
      else return this.questions.filter(question => question.revealed_at < date); // this.selectedPagination === 'Due event'
    },
    filterHistoryBetOptions() {
      if (this.isLogin) return this.historyBetOptions;
      else return [];
    },

    ...mapState('homePage', [
      // admin
      'isAdmin',
      'isAbleEdit',
      'adminList',
      'adminPaginationList',
      'dateValue',
      'timeValue',
      'selectedQuestionId',
      // homePage
      'topic',
      'isLogin',
      'pageName',
      'paginationList',
      'selectedPagination',
      'userInfo',
      'fetchQuestionLoading',
      'questions',
      'chosenOptions',
      'historyBetOptions',
      'isShowPopup',
      'betSum',
      'bonus',
      'getResult',
      'waitingResult',
    ]),
  },
}
</script>

<style scope>
/* admin css */
#adminContainer {
 padding-top: 20px;
}
#adminContainer .content {
  min-height: 80vh;
}
.adminFieldBox {
  padding: 10px;
  margin: 5px;
  box-sizing: border-box;
}
.adminContentBox {
  text-align: center;
}
.adminFieldBox .field, .adminContentBox .field {
  text-align: center;
  display: inline-block;
  vertical-align: middle;
}
.adminFieldBox .field:first-child, .adminContentBox .field:first-child {
  width: 14%;
}
.adminFieldBox .field:nth-child(2), .adminContentBox .field:nth-child(2) {
  width: 22%;
}
.adminFieldBox .field:nth-child(3), .adminContentBox .field:nth-child(3) {
  width: 22%;
}
.adminFieldBox .field:nth-child(4), .adminContentBox .field:nth-child(4) {
  width: 20%;
}
.adminFieldBox .field:nth-child(5), .adminContentBox .field:nth-child(5) {
  width: 20%;
}
input[type="date"] {
    display: inline-block;
    position: relative;
    font-size: 1em;
    width: 9.7em;
    font-family: sans-serif;
    vertical-align: middle;
}
/* admin css end */


/* homePage css */
h1 {
  font-size: 14px;
  color: gray;
  text-align: left;
}
.topic {
  font-size: 25px;
  font-weight: 500;
  margin: 60px 0 20px 0;
}
.container {
  width: 100%;
  height: 95vh;
  background: white;
  position: relative;
  padding-top: 20px;
}
.userInfoSection {
  width: 91%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.userInfoSection .leftSection {
  width: 30%;
  text-align: left;
}
.userInfoSection .rightSection, .userInfoSection .rightSection .userInfo {
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.userInfoSection .rightSection .userInfo {
  width: 100%;
}
.userInfoSection .rightSection img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.userInfoSection .rightSection .usernameBox {
  margin-right: 20px;
}
.LoginOutBtn {
  width: 100px;
  color: black;
  background: #eeeeee;
  border: 1px solid black;
  padding: 5px;
  box-sizing: border-box;
}
.paginationContainer {
  width: 100%;
  height: 100%;
  background: red;
}
nav {
  text-align: left;
  position: relative;
  top: 2px;
  z-index: 99;
}
nav ul li {
  border: 2px solid #eeeeee;
  border-bottom: none;
  padding: 5px;
  box-sizing: border-box;
}
nav ul li.selected {
  border-bottom: 2px solid black;
}
.content {
  width: 91%;
  margin: auto;
}
.pagination {
  min-height: 80vh;
  border: 2px solid #eeeeee;
}
.question-box {
  min-height: 70px;
  padding: 10px;
  margin: 5px;
  text-align: left;
  position: relative;
}
.question-box .bettingInput {
  width: 70px;
  position: absolute;
  top: 30px;
  right: 30px;
  border: 1px solid black;
  text-align: center;
  background: white;
}
.question-box ul li {
  margin-right: 70px;
}
.question-title {
  display: inline;
}
.odd {
  color:#93743d;
  margin-left: 20px;
}
.resultInfo {
  color: #b32400;
}
.resultInfo.green {
  color: #8ce600;
}
.confirmBtn {
  border: 1px solid gray;
  border-radius: 10px;
  width: 200px;
  padding: 8px 8px;
  box-sizing: border-box;
  color: #f04134;
  background-color: #f7f7f7;
  border-color: #d9d9d9;
}
.margin-filling-50 {
  margin: 50px auto;
}

/* popup css */
.popup {
  width: 500px;
  height: 350px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background: #eeeeee;
  border: 1px solid gray;
}
.popup {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
}
.popup .btnBox {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.popup .btnBox .btn {
  border: 1px solid gray;
  border-radius: 8px;
  padding: 5px 10px;
  box-sizing: border-box;
}

/* betting history css */
.filterContainer {
  margin: 20px 10px 50px 0;
  display: flex;
  justify-content: flex-end;
}
.filterContainer .text {
  margin-right: 10px;
}
.bettingHistoryContainer {
  width: 98%;
  margin: auto;
}
.bettingHistoryContainer ul li {
  border-left: 1px solid gray;
  box-sizing: border-box;
  font-weight: 600;
}
.bettingHistoryContainer ul li:first-child, .bettingHistoryContainer .items:first-child {
  width: 13%;
  border: none;
}
.bettingHistoryContainer ul li:nth-child(2), .bettingHistoryContainer .items:nth-child(2) {
  width: 16%;
}
.bettingHistoryContainer ul li:nth-child(3), .bettingHistoryContainer .items:nth-child(3) {
  width: 16%;
}
.bettingHistoryContainer ul li:nth-child(4), .bettingHistoryContainer .items:nth-child(4) {
  width: 20%;
}
.bettingHistoryContainer ul li:nth-child(5), .bettingHistoryContainer .items:nth-child(5) {
  width: 10%;
}
.bettingHistoryContainer ul li:nth-child(6), .bettingHistoryContainer .items:nth-child(6) {
  width: 25%;
}
.bettingHistoryContainer .items {
  width: 16%;
  display: inline-block;
}
</style>
