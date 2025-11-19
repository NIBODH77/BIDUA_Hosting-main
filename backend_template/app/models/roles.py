"""
Role-Based Access Control (RBAC) Models
Defines roles, permissions, and departments for the system
"""
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Table, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


# Association table for many-to-many relationship between roles and permissions
role_permissions = Table(
    'role_permissions',
    Base.metadata,
    Column('role_id', Integer, ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True),
    Column('permission_id', Integer, ForeignKey('permissions.id', ondelete='CASCADE'), primary_key=True),
    Column('created_at', DateTime(timezone=True), server_default=func.now())
)


# Association table for many-to-many relationship between users and roles
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users_profiles.id', ondelete='CASCADE'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True),
    Column('assigned_at', DateTime(timezone=True), server_default=func.now()),
    Column('assigned_by', Integer, ForeignKey('users_profiles.id'), nullable=True)
)


class Department(Base):
    """Departments for organizing roles and users"""
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(20), nullable=False, unique=True)  # e.g., 'SALES', 'SUPPORT', 'TECH'
    description = Column(Text, nullable=True)
    parent_id = Column(Integer, ForeignKey('departments.id'), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    parent = relationship("Department", remote_side=[id], backref="sub_departments")
    roles = relationship("Role", back_populates="department")
    
    def __repr__(self):
        return f"<Department(id={self.id}, name='{self.name}', code='{self.code}')>"


class Role(Base):
    """Roles define what users can do in the system"""
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(50), nullable=False, unique=True)  # e.g., 'ADMIN', 'AFFILIATE', 'SUPPORT_AGENT'
    description = Column(Text, nullable=True)
    department_id = Column(Integer, ForeignKey('departments.id'), nullable=True)
    is_system_role = Column(Boolean, default=False)  # Cannot be deleted
    is_active = Column(Boolean, default=True, nullable=False)
    level = Column(Integer, default=0)  # Hierarchy level for role precedence
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    department = relationship("Department", back_populates="roles")
    permissions = relationship("Permission", secondary=role_permissions, back_populates="roles")
    
    def __repr__(self):
        return f"<Role(id={self.id}, name='{self.name}', code='{self.code}')>"


class Permission(Base):
    """Permissions define specific actions that can be performed"""
    __tablename__ = "permissions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(100), nullable=False, unique=True)  # e.g., 'user.create', 'server.delete'
    resource = Column(String(50), nullable=False)  # e.g., 'user', 'server', 'billing'
    action = Column(String(50), nullable=False)  # e.g., 'create', 'read', 'update', 'delete'
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    roles = relationship("Role", secondary=role_permissions, back_populates="permissions")
    
    def __repr__(self):
        return f"<Permission(id={self.id}, code='{self.code}')>"


class UserDepartment(Base):
    """Assignment of users to departments"""
    __tablename__ = "user_departments"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users_profiles.id', ondelete='CASCADE'), nullable=False)
    department_id = Column(Integer, ForeignKey('departments.id', ondelete='CASCADE'), nullable=False)
    is_primary = Column(Boolean, default=True)  # Primary department
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())
    assigned_by = Column(Integer, ForeignKey('users_profiles.id'), nullable=True)
    
    def __repr__(self):
        return f"<UserDepartment(user_id={self.user_id}, department_id={self.department_id})>"
