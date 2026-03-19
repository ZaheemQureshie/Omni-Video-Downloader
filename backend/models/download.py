from sqlalchemy import Column, String, Float, Integer, DateTime, func
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

DATABASE_URL = "sqlite+aiosqlite:///./downloads.db"

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class Download(Base):
    __tablename__ = "downloads"

    download_id = Column(String, primary_key=True, index=True)
    url = Column(String, nullable=False)
    title = Column(String, default="")
    filename = Column(String, default="")
    status = Column(String, default="pending")  # pending, downloading, finished, error, cancelled
    progress = Column(Float, default=0.0)
    speed = Column(String, default="")
    eta = Column(Integer, default=0)
    filesize = Column(Integer, default=0)
    platform = Column(String, default="other")
    quality = Column(String, default="best")
    format = Column(String, default="mp4")
    file_path = Column(String, default="")
    error_message = Column(String, default="")
    created_at = Column(DateTime, server_default=func.now())


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session
