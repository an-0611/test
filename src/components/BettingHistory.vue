<template>
    <div>
        <div class="filterContainer">
            <span class="text">Filter by: </span>
            <select name="answerType" v-model="sortSelected">
                <option v-for="(name, index) in sortOptions" :value="name" :key="index">{{ name }}</option>
            </select>
        </div>
        <div class="bettingHistoryContainer">
            <ul>
                <li v-for="(name, index) in optionsName" :key="index">{{ name }}</li>
            </ul>
            <Loading v-if="historyDataLoading" />
            <template v-else>
                <NoData v-if="!filterHistory.length" text="history" />
                <div v-else>
                    <div class="itemsContainer" v-for="item in filterHistory" :key="item.questionId">
                        <div class="items">{{ item.questionId }}</div>
                        <div class="items">{{ item.title }}</div>
                        <div class="items">{{ item.chips }}</div>
                        <div class="items">{{ item.answerTitle }}</div>
                        <div class="items">{{ item.odds }}</div>
                        <div class="items">{{ item.claimBonus || 0 }}</div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import Loading from './Loading';
import NoData from './NoData';

export default {
    name: 'BettingHistory',
    components: {
        Loading,
        NoData,
    },
    props: {
        filterHistoryBetOptions: Array,
    },
    data() {
        return {
            sortSelected: 'All',
            sortOptions: ['All', 'Correct answer', 'Wrong answer'],
            optionsName: ['No', 'Question', 'Betting chip', 'Correct answer', 'Odds', 'Bonus Chips earned'],
            historyDataLoading: false,
        }
    },
    computed: {
        filterHistory() {
            switch (this.sortSelected) {
                case 'Correct answer':
                    return this.filterHistoryBetOptions.filter(el => el.claimBonus);
                case 'Wrong answer':
                    return this.filterHistoryBetOptions.filter(el => !el.claimBonus);
                default:
                    return this.filterHistoryBetOptions;
            }
        }
    },
}
</script>

<style scoped>
    .itemsContainer {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
        margin-top: 15px;
        padding: 10px;
        box-sizing: border-box;
    }
</style>
