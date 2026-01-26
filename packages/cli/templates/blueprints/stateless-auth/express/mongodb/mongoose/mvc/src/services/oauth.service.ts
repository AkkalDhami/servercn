import { AuthService, Context } from "./auth.service";
import User from "../models/user.model";

type OAuthProfile = {
  provider: string;
  providerId: string;
  name: string;
  email: string | undefined;
  isEmailVerified: boolean;
  avatar: string | undefined;
};

export class OAuthService {
  static async handleOAuthLogin(user: OAuthProfile, context: Context) {
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
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
        isEmailVerified: newUser.isEmailVerified
      },
      context
    );

    return newUser;
  }
}
