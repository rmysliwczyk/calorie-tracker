from rest_framework import permissions

class IsOwnerOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_staff:
            return True
        else:
            return view.action in ['retrieve', 'update']
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or obj.user == request.user:
            return True