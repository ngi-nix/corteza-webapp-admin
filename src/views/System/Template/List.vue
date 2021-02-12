<template>
  <b-container
    class="py-3"
  >
    <c-content-header
      :title="$t('title')"
    >
      <b-button-group
        v-if="canCreate"
      >
        <b-button
          variant="link"
          :to="{ name: 'system.template.new' }"
        >
          {{ $t('new') }}
        </b-button>
      </b-button-group>
      <b-button-group
        v-if="canGrant"
      >
        <c-permissions-button
          :title="$t('title')"
          resource="system:template:*"
          button-variant="link"
        >
          {{ $t('permissions') }}
        </c-permissions-button>
      </b-button-group>
      <b-dropdown
        v-if="false"
        variant="link"
        right
        menu-class="shadow-sm"
        text="Export"
      >
        <b-dropdown-item-button variant="link">
          {{ $t('yaml') }}
        </b-dropdown-item-button>
      </b-dropdown>
      <c-corredor-manual-buttons
        ui-page="template/list"
        ui-slot="toolbar"
        resource-type="system"
        default-variant="link"
        class="mr-1"
        @click="dispatchCortezaSystemEvent($event)"
      />
    </c-content-header>
    <c-resource-list
      primary-key="templateID"
      edit-route="system.template.edit"
      :loading-text="$t('loading')"
      :paging="paging"
      :sorting="sorting"
      :items="items"
      :fields="fields"
    >
      <template #filter>
        <b-form-group
          class="p-0 m-0"
        >
          <b-input-group>
            <b-form-input
              v-model.trim="filter.handle"
              :placeholder="$t('filterForm.handle.placeholder')"
              @keyup="filterList"
            />
          </b-input-group>
        </b-form-group>
        <b-row
          no-gutters
          class="mt-3"
        >
          <c-resource-list-status-filter
            v-model="filter.deleted"
            class="col-12 col-lg-6 mb-1 mb-lg-0"
            :label="$t('filterForm.deleted.label')"
            :excluded-label="$t('filterForm.excluded.label')"
            :inclusive-label="$t('filterForm.inclusive.label')"
            :exclusive-label="$t('filterForm.exclusive.label')"
            @change="filterList"
          />
        </b-row>
      </template>
    </c-resource-list>
  </b-container>
</template>

<script>
import * as moment from 'moment'
import listHelpers from 'corteza-webapp-admin/src/mixins/listHelpers'

export default {
  mixins: [
    listHelpers,
  ],

  i18nOptions: {
    namespaces: [ 'system.templates' ],
    keyPrefix: 'list',
  },

  data () {
    return {
      id: 'templates',

      canCreate: false,
      canGrant: false,

      filter: {
        handle: '',
        archived: 0,
        deleted: 0,
      },

      fields: [
        {
          key: 'meta.short',
          sortable: true,
        },
        {
          key: 'handle',
          sortable: true,
        },
        {
          key: 'language',
          sortable: true,
        },
        {
          key: 'createdAt',
          label: 'Created',
          sortable: true,
          formatter: (v) => moment(v).fromNow(),
        },
        {
          key: 'actions',
          label: '',
          tdClass: 'text-right',
        },
      ].map(c => ({
        ...c,
        // Generate column label translation key
        label: this.$t(`columns.${c.key}`),
      })),
    }
  },

  created () {
    this.fetchEffective()
  },

  methods: {
    items () {
      return this.procListResults(this.$SystemAPI.templateList(this.encodeListParams()))
    },

    fetchEffective () {
      this.incLoader()

      this.$SystemAPI.permissionsEffective()
        .then(rules => {
          this.canCreate = rules.find(({ resource, operation, allow }) => resource === 'system' && operation === 'template.create').allow
          this.canGrant = rules.find(({ resource, operation, allow }) => resource === 'system' && operation === 'grant').allow
        })
        .catch(this.stdReject)
        .finally(() => {
          this.decLoader()
        })
    },
  },
}
</script>