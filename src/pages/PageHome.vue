<template>
    <q-page class="relative-position">
        <q-scroll-area class="absolute full-width full-height">
            <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
                <div class="col">
                    <q-input
                        v-model="newMweetContent"
                        class="new-mweet"
                        placeholder="What's happening?"
                        maxlength="280"
                        bottom-slots
                        counter
                        autogrow
                    >
                        <template v-slot:before>
                            <q-avatar size="xl">
                                <img src="https://picsum.photos/200">
                            </q-avatar>
                        </template>
                    </q-input>
                </div>
                <div class="col col-shrink">
                    <q-btn
                        @click="addNewMweet"
                        :disable="!newMweetContent"
                        class="q-mb-lg"
                        color="primary"
                        label="Mweet"
                        rounded
                        unelevated
                        no-caps
                    />
                </div>
            </div>

            <q-separator
                class="divider"
                color="grey-2"
                size="10px"
            />

            <q-list separator>
                <transition-group
                    appear
                    enter-active-class="animated fadeIn slow"
                    leave-active-class="animated fadeOut slow"
                >
                    <q-item
                        v-for="mweet in mweets"
                        :key="mweet.id"
                        class="mweet q-py-md"
                    >
                        <q-item-section avatar top>
                            <q-avatar size="xl">
                                <img src="https://picsum.photos/200">
                            </q-avatar>
                        </q-item-section>

                        <q-item-section>
                            <q-item-label class="text-subtitle1">
                                <strong>Cup of CS</strong>
                                <span class="text-grey-7">
                  @cupofcs
                  <br class="lt-md">&bull; {{ dateInFormatRelative(mweet.date) }}
                </span>
                            </q-item-label>
                            <q-item-label class="mweet-conåtent text-body1">{{ mweet.content }}</q-item-label>
                            <div class="mweet-icons row justify-between q-mt-sm">
                                <q-btn
                                    color="grey"
                                    icon="far fa-comment"
                                    size="sm"
                                    flat
                                    round
                                />
                                <q-btn
                                    color="grey"
                                    icon="fas fa-retweet"
                                    size="sm"
                                    flat
                                    round
                                />
                                <q-btn
                                    @click="toggleLiked(mweet)"
                                    :color="mweet.liked ? 'pink' : 'grey'"
                                    :icon="mweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                                    size="sm"
                                    flat
                                    round
                                />
                                <q-btn
                                    @click="deleteMweet(mweet.id)"
                                    color="grey"
                                    icon="fas fa-trash"
                                    size="sm"
                                    flat
                                    round
                                />
                            </div>
                        </q-item-section>
                    </q-item>
                </transition-group>
            </q-list>
        </q-scroll-area>
    </q-page>
</template>

<script lang="ts">
import {formatDistance} from 'date-fns'
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import ExampleComponent from 'components/ExampleComponent.vue';
import {defineComponent, onMounted, onUnmounted, Ref, ref} from 'vue';
import {Builder} from "builder-pattern";
import {MweetModel} from "src/models/mweet/mweetModel";
import firestore from "boot/firebase";
import { deleteDoc, updateDoc, addDoc, doc } from "firebase/firestore";

export default defineComponent({
    name: 'PageHome',
    components: {ExampleComponent},
    setup() {
        const newMweetContent = ref('');
        const mweets: Ref<MweetModel[]> = ref([]);
        const dateInFormatRelative = (val: number) => formatDistance(val, new Date())

        const addNewMweet = async () => {
            const newMweet = Builder<MweetModel>().content(newMweetContent.value).date(Date.now()).liked(false).build();
            await addDoc(collection(firestore, "mweets"), newMweet);

            newMweetContent.value = '';
        }

        const deleteMweet = async(id: string) => {
            await deleteDoc(doc(firestore, "mweets", id));
        }

        const toggleLiked = async (mweet: MweetModel) => {
            const washingtonRef = doc(firestore, "mweets", mweet.id);
            await updateDoc(washingtonRef, {liked: ! mweet.liked})
        }
        onMounted(() => {
            const q = query(collection(firestore, 'mweets'), orderBy('date'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    const mweetChange = {...change.doc.data(), id: change.doc.id} as MweetModel;
                    if (change.type === "added") {
                        mweets.value.unshift(mweetChange);
                    }
                    if (change.type === "modified") {
                        const index  = mweets.value.findIndex(val => val.id === mweetChange.id)
                        Object.assign(mweets.value[index], mweetChange);
                    }
                    if (change.type === "removed") {
                        console.log(mweetChange)
                        mweets.value = mweets.value.filter(val => val.id !== mweetChange.id);
                    }
                });
            });
        })
        return {newMweetContent, mweets, dateInFormatRelative, addNewMweet, deleteMweet, toggleLiked}
    }
});
</script>

<style lang="sass">
.new-mweet
    textarea
        font-size: 19px
        line-height: 1.4 !important

.divider
    border-top: 1px solid
    border-bottom: 1px solid
    border-color: $grey-4

.mweet:not(:first-child)
    border-top: 1px solid rgba(0, 0, 0, 0.12)

.mweet-content
    white-space: pre-line

.mweet-icons
    margin-left: -5px
</style>
