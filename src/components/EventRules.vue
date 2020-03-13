<template>
    <div class="eventRulesContainer">
        <ul>
            <li>
                <p>If one or more legs of the accumulator are either a push, cancellation, or no action, the accumulator would be recalculated, and reduced, based on the remaining legs that have action.</p>
            </li>
            <li>
                <p>A push, cancellation or no action in a two-team parlay is paid as a straight play on the remaining leg using the original risk amount to calculate the win amount.</p>
            </li>
            <li>
                <p>In case of postponement of a leg or legs, accumulators will follow the Pinnacle rules listed for each specific sport. For example, if a straight bet would have had no action based on our rules, then that leg of the accumulator would also have no action.</p>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
  name: 'EventRules',
}
</script>

<style scoped>
    .eventRulesContainer {
        width: 50%;
        margin: auto;
        text-align: left;
    }
    .eventRulesContainer ul {
        list-style:decimal
    }
    .eventRulesContainer ul li {
        display: list-item;
    }
</style>
