from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field


class Settings(BaseSettings):
    database_host: str
    database_port: int
    database_name: str
    database_user: str
    database_password: str

    secret_key: str
    algorithm: str
    access_token_expire_minutes: int

    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False
    )

    @computed_field
    @property
    def database_url(self) -> str:
        return (
            f"postgresql://{self.database_user}:"
            f"{self.database_password}@"
            f"{self.database_host}:"
            f"{self.database_port}/"
            f"{self.database_name}"
        )


settings = Settings()