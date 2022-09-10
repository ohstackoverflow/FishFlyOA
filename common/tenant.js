import request from 'common/request.js'

const TenantIdKey = 'TENANT_ID'
const TenantNameKey = 'TENANT_NAME'

export function setTenantId(username) {
  localStorage.setItem(TenantIdKey, username)
}

export function getTenantId() {
  return localStorage.getItem(TenantIdKey);
}

export function getTenantIdByName(name) {
	return request
	.get("/system/tenant/get-id-by-name", {
		data:{
			name: name
		},
	});
}
