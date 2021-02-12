<template>
  <b-row>
    <!-- Toolbox -->
    <b-col cols="3">
      <editor-toolbox
        :template="template"
        :partials="partials"
      />
    </b-col>

    <!-- PDF preview modal -->
    <b-modal
      v-model="previewModalVisible"
      hide-footer
      centered
      size="lg"
      body-class="px-5"
      @hidden="previewBlob = ''"
    >
      <iframe
        v-if="previewBlob"
        class="w-100 vh-100"
        :src="previewBlob"
      />
    </b-modal>

    <!-- Content editor -->
    <b-col cols="9">
      <b-card
        class="shadow-sm"
        header-bg-variant="white"
        footer-bg-variant="white"
      >
        <component
          :is="editor"
          :template="template"
        />

        <template #header>
          <h3 class="m-0">
            {{ $t('title') }}

            <b-badge
              v-if="template.partial"
              variant="primary"
              style="border-radius: 0.5rem;"
              class="py-1"
            >
              {{ $t('partial') }}
            </b-badge>
          </h3>
        </template>

        <template #footer>
          <c-submit-button
            :disabled="!canCreate"
            class="float-right"
            :processing="processing"
            :success="success"
            @submit="$emit('submit', template)"
          />
        </template>
      </b-card>

      <!-- Preview configuration -->
      <b-card
        v-if="!template.partial"
        class="shadow-sm mt-3"
        header-bg-variant="white"
        footer-bg-variant="white"
      >
        <!-- Partial templates can't be previewed -->
        <ace-editor
          :font-size="14"
          :show-print-margin="true"
          :show-gutter="true"
          :highlight-active-line="true"
          class="mt-1"
          width="100%"
          height="200px"
          mode="json"
          theme="chrome"
          name="preview-data"
          :on-change="(v) => previewData = v"
          :value="previewData"
          :editor-props="{
            $blockScrolling: false,
          }"
        />

        <template #header>
          <h3 class="m-0">
            {{ $t('preview.title') }}
          </h3>
        </template>

        <template #footer>
          <b-button-group
            class="float-right"
          >
            <b-btn
              variant="primary"
              @click="openPreview('html')"
            >
              {{ $t('preview.html') }}
            </b-btn>

            <b-btn
              variant="primary"
              @click="openPreview('pdf')"
            >
              {{ $t('preview.pdf') }}
            </b-btn>
          </b-button-group>
        </template>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import listHelpers from 'corteza-webapp-admin/src/mixins/listHelpers'
import CSubmitButton from 'corteza-webapp-admin/src/components/CSubmitButton'
import EditorToolbox from './EditorToolbox'
import EditorTextHtml from './EditorTextHtml'
import EditorTextPlain from './EditorTextPlain'
import EditorUnsupported from './EditorUnsupported'
import { Ace as AceEditor } from 'vue2-brace-editor'

import 'brace/mode/json'
import 'brace/theme/chrome'

export default {

  components: {
    CSubmitButton,
    AceEditor,
    EditorToolbox,
  },
  mixins: [
    listHelpers,
  ],

  i18nOptions: {
    namespaces: [ 'system.templates' ],
    keyPrefix: 'editor.content',
  },

  props: {
    template: {
      type: Object,
      required: true,
      default: () => ({}),
    },

    partials: {
      type: Array,
      required: false,
      default: () => [],
    },

    processing: {
      type: Boolean,
      value: false,
    },

    success: {
      type: Boolean,
      value: false,
    },

    canCreate: {
      type: Boolean,
      required: true,
    },
  },

  data () {
    return {
      // @todo i18n this?
      previewData: '{\n  "variables": {\n    "param1": "value1",\n    "param2": {\n      "nestedParam1": "value2"\n    }\n  },\n  "options": {\n    "documentSize": "A4",\n    "contentScale": "1",\n    "orientation": "portrait",\n    "margin": "0.3"\n  }\n}\n',

      previewModalVisible: false,
      previewBlob: '',
    }
  },

  computed: {
    editor () {
      switch (this.template.type) {
        case 'text/html':
          return EditorTextHtml
        case 'text/plain':
          return EditorTextPlain
        default:
          return EditorUnsupported
      }
    },
  },

  methods: {
    openPreview (ext) {
      this.incLoader()

      const cfg = {
        method: 'post',
        responseType: 'blob',
        url: this.$SystemAPI.templateRenderEndpoint({
          templateID: this.template.templateID,
          filename: 'preveiw',
          ext,
        }),
        data: JSON.parse(this.previewData),
      }

      this.$SystemAPI.api().request(cfg)
        .then(r => {
          this.previewBlob = window.URL.createObjectURL(r.data)
          this.previewModalVisible = true
        })
        .catch(this.stdReject)
        .finally(() => {
          this.decLoader()
        })
    },
  },
}
</script>