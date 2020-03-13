import api from '../../api/homePage';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
api.initMockData();

axios.get('/questions').then(response => {
    console.log(response.data);
});
axios.get('/userInfo').then(response => {
    console.log(response.data);
});

let mock = new MockAdapter(axios);

const state = {
    isAdmin: false,
    isAbleEdit: false,
    adminList: ['hean@garena.com', 'wuan@garena.com', 'tsengv@garena.com'],
    adminPaginationList: ['Not Started', 'In progress', 'Due event'],
    dateValue: {},
    timeValue: {},
    selectedQuestionId: -1, // admin want modify questionId

    pageName: 'HomePage',
    topic: 'S9 World Pickem',
    currentTime: new Date().getTime(),
    selectedPagination: 'HomePage',
    paginationList: ['HomePage', 'Event Rules', 'Betting History'],
    isLogin: false,
    userInfo: {},
    questions: [],
    fetchQuestionLoading: true,
    chosenQuestionId: [],
    chosenOptions: [],
    isUpdating: false,
    betSum: 0,
    bonus: 0,
    historyBetOptions: [],
    waitingResult: false,
    getResult: false,
    isShowPopup: false,
}

// getters
const getters = {
}

// actions
const actions = {
    async fetchQuestions ({ commit }) {
        const url = 'https://979a61c8-02cc-437b-9be5-fcc5f59bd77e.mock.pstmn.io/api/v1/questions/';
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        commit('setFetchQuestionLoading', true);
        const response = await fetch(url, requestOptions);
        const res = await response.json();
        if (response.status === 200) {
            const questions = res.data;
            commit('setQuestions', questions);
            commit('setChosenOptions', new Array(questions.length));
            commit('setFetchQuestionLoading', false);
            return;
        }
        // other status code
        throw new Error(`result message:  ${res.message}`);
    },
    async fetchUserInfo ({ dispatch }) {
        const url = 'https://979a61c8-02cc-437b-9be5-fcc5f59bd77e.mock.pstmn.io/api/v1/user/profile/';
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        const response = await fetch(url, requestOptions);
        const res = await response.json();
        if (response.status === 200) {
            const userInfo = res.data;
            dispatch('setUserInfo', { userInfo });
            return;
        }
        // other status code
        throw new Error(`result message:  ${res.message}`);
    },
    async fetchHistory ({ commit }) {
        if (!state.historyBetOptions.length) commit('setHistoryBetOptions', []);
        else axios.get('/history').then(response => {
            console.log(response.data);
            // dispatch to set History Data
        });

        // const url = 'https://979a61c8-02cc-437b-9be5-fcc5f59bd77e.mock.pstmn.io/api/v1/user/profile/';
        // const requestOptions = {
        //     method: 'GET',
        //     redirect: 'follow'
        // };
        // const response = await fetch(url, requestOptions);
        // const res = await response.json();
        // if (response.status === 200) {
        //     const userInfo = res.data;
        //     dispatch('setUserInfo', { userInfo });
        //     return;
        // }
        // // other status code
        // throw new Error(`result message:  ${res.message}`);
    },
    setUserInfo ({ commit }, { userInfo }) {
        commit('onSignIn', userInfo);
        commit('setIsLogin', true);
        commit('handlePageName', 'betting');
        commit('setChosenOptions', new Array(state.questions.length));
    },
    setPagination ({ commit }, { name }) {
        commit('handleSelectedPage', name);
    },
    setBetSum ({ commit }, { betSum }) {
        commit('setBetSum', betSum);
    },
    confirmBet ({ commit }) {
        commit('handlePageName', 'waiting for results');
        commit('isWaitingResult', true);
    },
    setBonus ({ commit }, { bonus }) {
        commit('isGetResult', true);
        commit('isWaitingResult', false);
        commit('handlePageName', 'results release');
        commit('setBonus', bonus);
    },
    confirmClaimBonus ({ commit }) {
        const calcChips = (state.userInfo.chips - state.betSum) + state.bonus;
        commit('resetBet');
        commit('isGetResult', false);
        commit('isWaitingResult', false);
        commit('updateUserInfo', calcChips);
        commit('setHistoryBetOptions', state.chosenOptions.filter(Boolean));
        commit('setChosenOptions', []);
        mock.onGet('/history').reply(200, { ...state.historyBetOptions });
    },
    adminLogin ({ commit }) {
        commit('setIsLogin', true);
        commit('handleIsAdmin', true);
        commit('handleSelectedPage', 'Not Started');
        commit('handlePageName', 'admin backstage');
    },
    adminEdit ({ commit }, { questionId, initDateValue, initTimeValue }) {
        commit('handleIsAbleEdit', true);
        commit('setSelectedQuestionId', questionId);
        commit('setDateValue', initDateValue);
        commit('setTimeValue', initTimeValue);
    },
    cancelAdminEdit ({ commit }) {
        commit('handleIsAbleEdit', false);
    },
    logout ({ commit }) {
        window.gapi.auth2.getAuthInstance().disconnect();
        commit('setIsLogin', false);
        commit('handlePageName', 'HomePage');
        commit('handleSelectedPage', 'HomePage');
        commit('handleIsAdmin', false);
        commit('setChosenOptions', []);
    },
    showPopup ({ commit }) {
        commit('isShowPopup', true);
        commit('handlePageName', state.getResult ? 'claim bonus chips' : 'betting confirm');
    },
    closePopup ({ commit }) {
        commit('isShowPopup', false);
        commit('handlePageName', state.getResult ? 'results release' : 'betting');
    }
}

// mutations
const mutations = {
    handlePageName (state, name) {
        state.pageName = name;
    },
    handleSelectedPage (state, pageName) {
        state.selectedPagination = pageName;
    },
    onSignIn (state, userInfo) {
        let data = Object.assign({}, state.userInfo, userInfo); 
        state.userInfo = data;
        state.isLogin = true;
        state.pageName = 'betting';
    },
    updateUserInfo (state, chips) {
        state.userInfo = { ...state.userInfo, chips };
    },
    setFetchQuestionLoading(state, status) {
        state.fetchQuestionLoading = status;
    },
    setQuestions (state, questions) {
        state.questions = questions;
        state.fetchQuestionLoading = false;
    },
    setIsLogin (state, status) {
        state.isLogin = status;
    },
    setChosenOptions (state, newOptions) {
        state.chosenOptions = newOptions;
    },
    setIsUpdating (state, status) {
        state.updating = status;
    },
    setHistoryBetOptions (state, historyBetOptions) {
        state.historyBetOptions = state.historyBetOptions.concat(historyBetOptions);
    },
    setBetSum (state, betSum) {
        state.betSum = betSum;
    },
    setBonus (state, bonus) {
        state.bonus = bonus
    },
    resetBet (state) {
        state.bonus = 0;
        state.betSum = 0;
        state.getResult = false;
    },
    isShowPopup (state, status) {
        state.isShowPopup = status;
    },
    isGetResult (state, status) {
        state.getResult = status
    },
    isWaitingResult (state, status) {
        state.waitingResult = status;
    },

    // admin
    handleIsAdmin (state, status) {
        state.isAdmin = status;
    },
    handleIsAbleEdit (state, status) {
        state.isAbleEdit = status;
    },
    setDateValue (state, dateObj) {
        state.dateValue = dateObj
    },
    setTimeValue (state, timeObj) {
        state.timeValue = timeObj
    },
    setSelectedQuestionId (state, id) {
        state.selectedQuestionId = id;
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}