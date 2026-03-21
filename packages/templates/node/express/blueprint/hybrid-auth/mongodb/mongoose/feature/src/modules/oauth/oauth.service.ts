import { AuthService, CookieOptionsType } from "../auth/auth.service";
import User from "../auth/user.model";

type OAuthProfile = {
  provider: string;
  providerId: string;
  name: string;
  email: string | undefined;
  isEmailVerified: boolean;
  avatar: string | undefined;
  ip: string;
  userAgent: string;
};

export class OAuthService {
  static async handleOAuthLogin(
    user: OAuthProfile,
    context: CookieOptionsType
  ) {
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      await User.findByIdAndUpdate(existingUser._id, {
        provider: user.provider,
        providerId: user.providerId,
        isEmailVerified: user.isEmailVerified,
        avatar: {
          url: user.avatar
        }
      });
      await AuthService.handleToken(
        {
          _id: existingUser._id.toString(),
          role: existingUser.role,
          ip: user.ip,
          userAgent: user.userAgent
        },
        context
      );
      return existingUser;
    }

    const newUser = await User.create({
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,

      provider: user.provider,
      providerId: user.providerId,

      avatar: {
        url: user.avatar
      }
    });

    await AuthService.handleToken(
      {
        _id: newUser._id.toString(),
        role: newUser.role,
        ip: user.ip,
        userAgent: user.userAgent
      },
      context
    );

    return newUser;
  }
}
