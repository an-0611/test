const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
let mock = new MockAdapter(axios);

export default {
    initMockData() {
        mock.onGet('/questions').reply(200, {
            "success": true,
            "message": "",
            "data": [
                {
                    "id": 1,
                    "title": "Will Faker use hero Arika in S9?",
                    "created_at": "2019-10-15T06:25:02.932Z",
                    "start_at": "2019-10-15T06:25:02.932Z",
                    "revealed_at": "2020-12-15T06:25:02.932Z",
                    "options": [
                        {
                            "id": 1,
                            "title": "Yes",
                            "odds": 2
                        },
                        {
                            "id": 2,
                            "title": "No",
                            "odds": 2
                        }
                    ],
                    "answer": {
                        "id": 1,
                        "title": "Yes",
                        "odds": 2
                    }
                },
                {
                    "id": 2,
                    "title": "Which of the following team will be the first runner-up of S9?",
                    "created_at": "2019-10-15T06:25:02.932Z",
                    "start_at": "2019-10-15T06:25:02.932Z",
                    "revealed_at": "2020-10-15T06:25:02.932Z",
                    "options": [
                        {
                            "id": 3,
                            "title": "RNG",
                            "odds": 3
                        },
                        {
                            "id": 4,
                            "title": "FNC",
                            "odds": 3
                        },
                        {
                            "id": 5,
                            "title": "GNF",
                            "odds": 3
                        },
                        {
                            "id": 6,
                            "title": "G2",
                            "odds": 3
                        }
                    ],
                    "answer": {
                        "id": 4,
                        "title": "FNC",
                        "odds": 3
                    }
                },
                {
                    "id": 3,
                    "title": "Which of the following team will be the champion of S9?",
                    "created_at": "2019-10-15T06:25:02.932Z",
                    "start_at": "2018-10-15T06:25:02.932Z",
                    "revealed_at": "2019-10-15T06:25:02.932Z",
                    "options": [
                        {
                            "id": 7,
                            "title": "SKT",
                            "odds": 2
                        },
                        {
                            "id": 8,
                            "title": "G2",
                            "odds": 2
                        },
                        {
                            "id": 9,
                            "title": "IG",
                            "odds": 2
                        },
                        {
                            "id": 10,
                            "title": "FNC",
                            "odds": 2
                        }
                    ],
                    "answer": {
                        "id": 9,
                        "title": "IG",
                        "odds": 2
                    }
                },
                {
                    "id": 4,
                    "title": "Will Theshy be the S9 MVP?",
                    "created_at": "2019-10-15T06:25:02.932Z",
                    "start_at": "2020-05-15T06:25:02.932Z",
                    "revealed_at": "2021-10-15T06:25:02.932Z",
                    "options": [
                        {
                            "id": 11,
                            "title": "Yes",
                            "odds": 3
                        },
                        {
                            "id": 12,
                            "title": "No",
                            "odds": 3
                        }
                    ],
                    "answer": {
                        "id": 11,
                        "title": "Yes",
                        "odds": 3
                    }
                }
            ]
        });

        mock.onGet('/userInfo').reply(200, {
            "success": true,
            "message": "",
            "data": {
                "avatar": "https://lh6.googleusercontent.com/-f2CumtXmANA/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3reDOFSqTQoqYDkOC4wzumgFnOAp4w/photo.jpg",
                "nickname": "An",
                "chips": 1234
            }
        });

        mock.onGet('/history').reply(200, {
            "success": true,
            "message": "",
            "data": [
                {
                    "questionId": 2,
                    "title": "Which of the following team will be the first runner-up of S9?",
                    "chips": 222,
                    "answerTitle": "GNF",
                    "odds": 3,
                    "claimBonus": 666
                },
            ]
        });

        // mock.onGet('/questions').reply(200, 
        // );
    }
}

